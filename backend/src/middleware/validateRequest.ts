import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from './errorHandler';

export const validateRequest = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()
      .map(error => `${(error as any).param}: ${error.msg}`)
      .join(', ');
    
    throw new ApiError(`Validation failed: ${errorMessage}`, 400);
  }
  
  next();
};