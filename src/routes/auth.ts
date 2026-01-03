import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { JWT_EXPIRES_IN, JWT_COOKIE_MAX_AGE_MS } from '../lib/constants';
import { createErrorResponse } from '../lib/errors';

const router = Router();

// POST /auth/login - Login with email and password
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(createErrorResponse('Email and password are required', 'VALIDATION_ERROR'));
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Don't reveal if user exists (security best practice)
      return res.status(401).json(createErrorResponse('Invalid email or password', 'AUTH_ERROR'));
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return res.status(401).json(createErrorResponse('Invalid email or password', 'AUTH_ERROR'));
    }

    // Create JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json(createErrorResponse('Server configuration error', 'CONFIG_ERROR'));
    }

    const token = jwt.sign({ userId: user.id }, secret, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict', // CSRF protection
      maxAge: JWT_COOKIE_MAX_AGE_MS,
    });

    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(createErrorResponse('Internal server error', 'SERVER_ERROR'));
  }
});

// POST /auth/logout - Logout (clear cookie)
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logout successful' });
});

// GET /auth/me - Get current user (optional, for checking auth status)
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json(createErrorResponse('Not authenticated', 'AUTH_ERROR'));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json(createErrorResponse('Server configuration error', 'CONFIG_ERROR'));
    }

    const decoded = jwt.verify(token, secret) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, createdAt: true }, // Don't send password hash
    });

    if (!user) {
      return res.status(401).json(createErrorResponse('User not found', 'AUTH_ERROR'));
    }

    res.json({ user });
  } catch (error) {
    return res.status(401).json(createErrorResponse('Invalid token', 'AUTH_ERROR'));
  }
});

export default router;

