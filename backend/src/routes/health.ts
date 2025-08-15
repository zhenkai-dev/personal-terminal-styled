import express from 'express';
import { getHealthStatus } from '@/controllers/healthController';

const router = express.Router();

/**
 * GET /health
 * Health check endpoint
 */
router.get('/', getHealthStatus);

export default router;