import { Request, Response, NextFunction } from "express";
import axios from "axios";

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
    // Check for user info from gateway headers (preferred method)
    const userId = req.headers["x-user-id"] as string;
    const userEmail = req.headers["x-user-email"] as string;

    if (userId) {
      // Trust the gateway - user has already been authenticated
      req.user = {
        id: userId,
        email: userEmail || ""
      };
      next();
      return;
    }

    // Fallback: Direct token validation (for backward compatibility or direct service access)
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "Access denied. No token provided." });
      return;
    }

    // Only validate with auth service if no gateway headers present
    const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
    
    try {
      const response = await axios.get(`${authServiceUrl}/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      req.user = response.data.user;
      next();
    } catch (authError) {
      res.status(401).json({ error: "Invalid token." });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: "Server error during authentication." });
  }
};

export { AuthenticatedRequest };
