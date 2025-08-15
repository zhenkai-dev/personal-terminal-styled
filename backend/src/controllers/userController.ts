import { Request, Response, NextFunction } from 'express';
import prisma from '@/utils/database';
import { ApiError } from '@/middleware/errorHandler';
import logger from '@/utils/logger';

/**
 * Get user profile by session ID
 */
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const user = await prisma.user.findUnique({
      where: { sessionId },
      include: {
        _count: {
          select: {
            commandExecutions: true,
            fileDownloads: true
          }
        }
      }
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          sessionId: user.sessionId,
          nickname: user.nickname,
          firstVisitAt: user.firstVisitAt,
          lastVisitAt: user.lastVisitAt,
          totalCommands: user.totalCommands,
          timezone: user.timezone,
          country: user.country,
          stats: {
            commandExecutions: user._count.commandExecutions,
            fileDownloads: user._count.fileDownloads
          }
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const { nickname, timezone } = req.body;

    const user = await prisma.user.findUnique({
      where: { sessionId }
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { sessionId },
      data: {
        ...(nickname && { nickname }),
        ...(timezone && { timezone })
      }
    });

    logger.info('User profile updated', {
      sessionId,
      updatedFields: { nickname: !!nickname, timezone: !!timezone }
    });

    res.json({
      status: 'success',
      data: {
        user: {
          id: updatedUser.id,
          sessionId: updatedUser.sessionId,
          nickname: updatedUser.nickname,
          timezone: updatedUser.timezone,
          lastVisitAt: updatedUser.lastVisitAt
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Delete all user data (GDPR compliance)
 */
export const deleteUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const user = await prisma.user.findUnique({
      where: { sessionId }
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Delete all user data in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete file downloads
      await tx.fileDownload.deleteMany({
        where: { userId: user.id }
      });

      // Set command executions userId to null (preserve analytics)
      await tx.commandExecution.updateMany({
        where: { userId: user.id },
        data: { userId: null }
      });

      // Delete user record
      await tx.user.delete({
        where: { id: user.id }
      });
    });

    logger.info('User data deleted (GDPR)', {
      sessionId,
      userId: user.id,
      ip: req.ip
    });

    res.json({
      status: 'success',
      message: 'All user data has been permanently deleted'
    });

  } catch (error) {
    next(error);
  }
};