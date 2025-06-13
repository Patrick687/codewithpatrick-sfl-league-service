import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const joinLeagueSchema = z.object({
  inviteCode: z.string()
    .length(6, 'Invite code must be exactly 6 characters')
    .optional(),
});

export const validateJoinLeague = (req: Request, res: Response, next: NextFunction): void => {
  try {
    joinLeagueSchema.parse(req.body);
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
export { joinLeagueSchema };