import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const createLeagueSchema = z.object({
    name: z.string()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must be at most 100 characters'),
    description: z.string()
        .max(500, 'Description must be at most 500 characters')
        .optional(),
});

export const validateCreateLeague = (req: Request, res: Response, next: NextFunction): void => {
    try {
        createLeagueSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
            res.status(400).json({ error: errorMessage });
            return;
        }
        res.status(400).json({ error: 'Invalid request data' });
    }
};

// Export the schema for potential reuse
export { createLeagueSchema };