import prisma from '@/utils/database';
import { User } from '@prisma/client';

export interface CreateUserData {
  sessionId: string;
  nickname?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  timezone?: string | null;
  country?: string | null;
}

/**
 * Get user by session ID
 */
export const getUserBySessionId = async (sessionId: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { sessionId }
  });
};

/**
 * Create or update user
 */
export const createOrUpdateUser = async (userData: CreateUserData): Promise<User> => {
  const { sessionId, nickname, ipAddress, userAgent, timezone, country } = userData;

  return await prisma.user.upsert({
    where: { sessionId },
    update: {
      ...(nickname && { nickname }),
      ...(timezone && { timezone }),
      lastVisitAt: new Date(),
      ...(country && { country })
    },
    create: {
      sessionId,
      nickname: nickname ?? null,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
      timezone: timezone ?? null,
      country: country ?? null,
      firstVisitAt: new Date(),
      lastVisitAt: new Date()
    }
  });
};

/**
 * Update user's last visit time
 */
export const updateUserLastVisit = async (sessionId: string): Promise<User> => {
  return await prisma.user.update({
    where: { sessionId },
    data: { lastVisitAt: new Date() }
  });
};

/**
 * Get user statistics
 */
export const getUserStats = async (sessionId: string) => {
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
    return null;
  }

  return {
    totalCommands: user.totalCommands,
    commandExecutions: user._count.commandExecutions,
    fileDownloads: user._count.fileDownloads,
    firstVisit: user.firstVisitAt,
    lastVisit: user.lastVisitAt
  };
};