// League service response utilities using shared types
import { 
  SuccessResponse, 
  ErrorResponse, 
  HealthCheckResponse,
  League as SharedLeague,
  LeagueParticipant as SharedLeagueParticipant,
  Pick as SharedPick
} from '@sfl/shared-types';

/**
 * Create a standardized success response
 */
export const createSuccessResponse = <T>(data: T, message?: string): SuccessResponse<T> => ({
  success: true,
  data,
  message
});

/**
 * Create a standardized error response
 */
export const createErrorResponse = (error: string, message: string): ErrorResponse => ({
  success: false,
  error,
  message
});

/**
 * Create health check response
 */
export const createHealthResponse = (status: 'ok' | 'error' = 'ok'): HealthCheckResponse => ({
  status,
  timestamp: new Date().toISOString(),
  service: 'sfl-league-service',
  version: '1.0.0',
  uptime: process.uptime()
});

// Note: League model conversion functions will be added here when we examine the league models
