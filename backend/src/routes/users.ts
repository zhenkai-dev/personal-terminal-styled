import express from 'express';
import { body, param } from 'express-validator';
import { 
  updateUserProfile,
  getUserProfile,
  deleteUserData 
} from '@/controllers/userController';
import { validateRequest } from '@/middleware/validateRequest';

const router = express.Router();

/**
 * GET /api/users/:sessionId/profile
 * Get user profile by session ID
 */
router.get('/:sessionId/profile', [
  param('sessionId')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Session ID is required'),
  validateRequest
], getUserProfile);

/**
 * PUT /api/users/:sessionId/profile
 * Update user profile
 */
router.put('/:sessionId/profile', [
  param('sessionId')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Session ID is required'),
  body('nickname')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nickname must be between 1 and 100 characters'),
  body('timezone')
    .optional()
    .isString()
    .trim(),
  validateRequest
], updateUserProfile);

/**
 * DELETE /api/users/:sessionId
 * Delete all user data (GDPR compliance)
 */
router.delete('/:sessionId', [
  param('sessionId')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Session ID is required'),
  validateRequest
], deleteUserData);

export default router;