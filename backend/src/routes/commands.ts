import express from 'express';
import { body, param, query } from 'express-validator';
import { 
  executeCommand, 
  getCommands, 
  getCommandResponse,
  downloadFile 
} from '@/controllers/commandController';
import { validateRequest } from '@/middleware/validateRequest';

const router = express.Router();

/**
 * GET /api/commands
 * Get all available commands
 */
router.get('/', getCommands);

/**
 * POST /api/commands/execute
 * Execute a command and track analytics
 */
router.post('/execute', [
  body('command')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Command is required'),
  body('sessionId')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Session ID is required'),
  body('nickname')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Nickname must be less than 100 characters'),
  body('timezone')
    .optional()
    .isString()
    .trim(),
  validateRequest
], executeCommand);

/**
 * GET /api/commands/:commandName/response
 * Get the current response for a specific command
 */
router.get('/:commandName/response', [
  param('commandName')
    .isString()
    .trim()
    .matches(/^\/[a-z-]+$/)
    .withMessage('Invalid command name format'),
  validateRequest
], getCommandResponse);

/**
 * GET /api/commands/download/:fileType
 * Download resume files (PDF or MD)
 */
router.get('/download/:fileType', [
  param('fileType')
    .isIn(['pdf', 'md'])
    .withMessage('File type must be either pdf or md'),
  query('sessionId')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Session ID is required'),
  validateRequest
], downloadFile);

export default router;