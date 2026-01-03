import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createErrorResponse } from '../lib/errors';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Authentication middleware
 * 
 * Verifies JWT token from httpOnly cookie and attaches userId to request object.
 * Protected routes should use this middleware to ensure the user is authenticated.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * 
 * @throws {401} If no token is provided or token is invalid
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Get token from httpOnly cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json(createErrorResponse('Unauthorized - No token provided', 'AUTH_ERROR'));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, secret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json(createErrorResponse('Unauthorized - Invalid token', 'AUTH_ERROR'));
  }
}

