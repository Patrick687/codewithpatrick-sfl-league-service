import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const createValidator = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        
        res.status(400).json({
          error: 'Validation failed',
          details: errorMessages,
        });
        return;
      }
      res.status(400).json({ error: 'Invalid request data' });
    }
  };
};

export const createQueryValidator = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        
        res.status(400).json({
          error: 'Query validation failed',
          details: errorMessages,
        });
        return;
      }
      res.status(400).json({ error: 'Invalid query parameters' });
    }
  };
};

export const createParamsValidator = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        
        res.status(400).json({
          error: 'Parameter validation failed',
          details: errorMessages,
        });
        return;
      }
      res.status(400).json({ error: 'Invalid parameters' });
    }
  };
};
