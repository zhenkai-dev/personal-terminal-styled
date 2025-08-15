import express from 'express';
import { query } from 'express-validator';
import { 
  getAnalyticsSummary,
  getCommandAnalytics,
  getUserAnalytics,
  getDashboardStats 
} from '@/controllers/analyticsController';
import { validateRequest } from '@/middleware/validateRequest';

const router = express.Router();

/**
 * GET /api/analytics/dashboard
 * Get dashboard statistics overview
 */
router.get('/dashboard', getDashboardStats);

/**
 * GET /api/analytics/summary
 * Get analytics summary with optional date range
 */
router.get('/summary', [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  query('period')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Period must be daily, weekly, or monthly'),
  validateRequest
], getAnalyticsSummary);

/**
 * GET /api/analytics/commands
 * Get command execution analytics
 */
router.get('/commands', [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  validateRequest
], getCommandAnalytics);

/**
 * GET /api/analytics/users
 * Get user behavior analytics
 */
router.get('/users', [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  validateRequest
], getUserAnalytics);

export default router;