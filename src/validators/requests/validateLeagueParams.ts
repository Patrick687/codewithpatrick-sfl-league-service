import { z } from "zod";
import { uuidSchema } from "./othervalidators";
import { createParamsValidator } from "./validators";

export const leagueParamsSchema = z.object({
  id: uuidSchema,
});

export const validateLeagueParams = createParamsValidator(leagueParamsSchema);