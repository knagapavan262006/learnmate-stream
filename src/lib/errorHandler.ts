/**
 * Safe error handler that maps database errors to user-friendly messages
 * without exposing internal schema details or sensitive information
 */

interface PostgrestError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

export function getSafeErrorMessage(error: unknown): string {
  // Log full error for debugging (server-side only in production)
  console.error('Operation failed:', error);
  
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Handle PostgreSQL/Supabase specific errors
  if (typeof error === 'object' && error !== null) {
    const pgError = error as PostgrestError;
    
    // Unique constraint violation
    if (pgError.code === '23505') {
      return 'A record with this information already exists.';
    }
    
    // Foreign key violation
    if (pgError.code === '23503') {
      return 'Cannot complete this operation due to related records.';
    }
    
    // Not null violation
    if (pgError.code === '23502') {
      return 'Required information is missing.';
    }
    
    // Check constraint violation
    if (pgError.code === '23514') {
      return 'The provided information does not meet the required format.';
    }
    
    // Permission/RLS errors
    const message = pgError.message?.toLowerCase() || '';
    if (
      message.includes('permission denied') || 
      message.includes('row-level security') ||
      message.includes('new row violates')
    ) {
      return 'You do not have permission to perform this action.';
    }
    
    // Authentication errors
    if (message.includes('jwt') || message.includes('token') || message.includes('auth')) {
      return 'Your session has expired. Please log in again.';
    }
    
    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
  }
  
  // Default safe message
  return 'An error occurred. Please try again.';
}
