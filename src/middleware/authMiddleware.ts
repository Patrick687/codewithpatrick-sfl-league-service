import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    // Verify token with auth service
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    
    try {
      const response = await axios.get(`${authServiceUrl}/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      req.user = response.data.user;
      next();
    } catch (authError) {
      res.status(401).json({ error: 'Invalid token.' });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error during authentication.' });
  }
};

export { AuthenticatedRequest };