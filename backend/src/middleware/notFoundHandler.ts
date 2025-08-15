import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new ApiError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};