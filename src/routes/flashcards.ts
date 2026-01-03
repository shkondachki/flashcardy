import { Router, Request, Response } from 'express';
import { Tech, Difficulty, Prisma } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { DEFAULT_PAGE_SIZE } from '../lib/constants';
import { createErrorResponse } from '../lib/errors';

const router = Router();

// GET /flashcards - List all flashcards with optional filtering and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tech, category, search, page, limit } = req.query;

    // Pagination params
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || DEFAULT_PAGE_SIZE;
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for Prisma query
    const where: Prisma.FlashcardWhereInput = {};

    // Filter by tech (exact match)
    if (tech && typeof tech === 'string') {
      if (Object.values(Tech).includes(tech as Tech)) {
        where.tech = tech as Tech;
      }
    }

    // Filter by category (array contains)
    if (category && typeof category === 'string') {
      where.categories = {
        has: category
      };
    }

    // Search in question and answer (case-insensitive)
    if (search && typeof search === 'string') {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination info
    const totalCount = await prisma.flashcard.count({ where });

    // Fetch paginated flashcards
    const flashcards = await prisma.flashcard.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    });

    // Calculate if there are more results
    const hasMore = skip + flashcards.length < totalCount;

    // Return paginated response
    res.json({
      flashcards,
      hasMore,
      page: pageNum,
      limit: limitNum,
      totalCount
    });
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json(createErrorResponse('Failed to fetch flashcards', 'FETCH_ERROR'));
  }
});

// GET /flashcards/:id - Get single flashcard
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const flashcard = await prisma.flashcard.findUnique({
      where: { id }
    });

    if (!flashcard) {
      return res.status(404).json(createErrorResponse('Flashcard not found', 'NOT_FOUND'));
    }

    res.json(flashcard);
  } catch (error) {
    console.error('Error fetching flashcard:', error);
    res.status(500).json(createErrorResponse('Failed to fetch flashcard', 'FETCH_ERROR'));
  }
});

/**
 * POST /flashcards - Create new flashcard (requires authentication)
 * 
 * Request body:
 * @param {string} question - Flashcard question (required)
 * @param {string} answer - Flashcard answer (required)
 * @param {Tech} tech - Technology category (required)
 * @param {string[]} categories - Array of category tags (optional)
 * @param {Difficulty} difficulty - Difficulty level: 'easy', 'medium', or 'hard' (optional)
 * 
 * @returns {Flashcard} Created flashcard object
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { question, answer, tech, categories, difficulty } = req.body;

    // Validate required fields
    if (!question || !answer || !tech) {
      return res.status(400).json(
        createErrorResponse('Missing required fields: question, answer, and tech are required', 'VALIDATION_ERROR')
      );
    }

    // Validate tech enum
    if (!Object.values(Tech).includes(tech)) {
      return res.status(400).json(
        createErrorResponse(`Invalid tech value. Must be one of: ${Object.values(Tech).join(', ')}`, 'VALIDATION_ERROR')
      );
    }

    // Validate difficulty enum if provided
    if (difficulty && !Object.values(Difficulty).includes(difficulty)) {
      return res.status(400).json(
        createErrorResponse(`Invalid difficulty value. Must be one of: ${Object.values(Difficulty).join(', ')}`, 'VALIDATION_ERROR')
      );
    }

    // Ensure categories is an array
    const categoriesArray = Array.isArray(categories) ? categories : (categories ? [categories] : []);

    const flashcard = await prisma.flashcard.create({
      data: {
        question,
        answer,
        tech,
        categories: categoriesArray,
        difficulty: difficulty || null
      }
    });

    res.status(201).json(flashcard);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json(createErrorResponse('Failed to create flashcard', 'CREATE_ERROR'));
  }
});

// PUT /flashcards/:id - Update flashcard (requires auth)
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer, tech, categories, difficulty } = req.body;

    // Check if flashcard exists
    const existing = await prisma.flashcard.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json(createErrorResponse('Flashcard not found', 'NOT_FOUND'));
    }

    // Validate tech enum if provided
    if (tech && !Object.values(Tech).includes(tech)) {
      return res.status(400).json(
        createErrorResponse(`Invalid tech value. Must be one of: ${Object.values(Tech).join(', ')}`, 'VALIDATION_ERROR')
      );
    }

    // Validate difficulty enum if provided
    if (difficulty && difficulty !== null && !Object.values(Difficulty).includes(difficulty)) {
      return res.status(400).json(
        createErrorResponse(`Invalid difficulty value. Must be one of: ${Object.values(Difficulty).join(', ')}`, 'VALIDATION_ERROR')
      );
    }

    // Build update data (only include provided fields)
    const updateData: Prisma.FlashcardUpdateInput = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (tech !== undefined) updateData.tech = tech;
    if (categories !== undefined) {
      updateData.categories = Array.isArray(categories) ? categories : [categories];
    }
    if (difficulty !== undefined) updateData.difficulty = difficulty || null;

    const flashcard = await prisma.flashcard.update({
      where: { id },
      data: updateData
    });

    res.json(flashcard);
  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json(createErrorResponse('Failed to update flashcard', 'UPDATE_ERROR'));
  }
});

// DELETE /flashcards/:id - Delete flashcard (requires auth)
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const flashcard = await prisma.flashcard.delete({
      where: { id }
    }).catch(() => null);

    if (!flashcard) {
      return res.status(404).json(createErrorResponse('Flashcard not found', 'NOT_FOUND'));
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json(createErrorResponse('Failed to delete flashcard', 'DELETE_ERROR'));
  }
});

export default router;
