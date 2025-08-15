import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import prisma from '@/utils/database';
import logger from '@/utils/logger';
import { ApiError } from '@/middleware/errorHandler';
import { trackCommandExecution } from '@/services/analyticsService';
import { getUserBySessionId, createOrUpdateUser } from '@/services/userService';
import geoip from 'geoip-lite';

/**
 * Get all available commands
 */
export const getCommands = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const commands = await prisma.command.findMany({
      where: { isActive: true },
      select: {
        name: true,
        description: true,
        category: true,
        responseType: true,
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      status: 'success',
      data: { commands }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Execute a command and return response
 */
export const executeCommand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { command, sessionId, nickname, timezone } = req.body;
    const startTime = Date.now();
    
    // Normalize command (ensure it starts with /)
    const normalizedCommand = command.startsWith('/') ? command : `/${command}`;
    
    // Get user information
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');
    const geo = ipAddress ? geoip.lookup(ipAddress) : null;
    const country = geo?.country ?? null;

    // Create or update user
    const user = await createOrUpdateUser({
      sessionId,
      nickname: nickname ?? null,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
      timezone: timezone ?? null,
      country,
    });

    // Check if command exists
    const commandRecord = await prisma.command.findUnique({
      where: { name: normalizedCommand, isActive: true }
    });

    if (!commandRecord) {
      const responseTime = Date.now() - startTime;
      
      // Track failed execution
      await trackCommandExecution({
        userId: user.id,
        commandName: normalizedCommand,
        responseTimeMs: responseTime,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
        success: false,
        errorMessage: 'Command not found'
      });

      throw new ApiError(`Command not found: ${normalizedCommand}. Type '/help' to see all available commands.`, 404);
    }

    let responseContent: string;
    let downloadInfo: any = null;

    // Handle different response types
    switch (commandRecord.responseType) {
      case 'DYNAMIC':
        responseContent = await generateDynamicResponse(normalizedCommand);
        break;
      
      case 'FILE_DOWNLOAD':
        const downloadResult = await handleFileDownload(normalizedCommand, user.id, ipAddress, userAgent);
        responseContent = downloadResult.message;
        downloadInfo = downloadResult.downloadInfo;
        break;
      
      case 'STATIC':
      default:
        const commandResponse = await prisma.commandResponse.findFirst({
          where: { 
            commandName: normalizedCommand,
            isActive: true 
          },
          orderBy: { version: 'desc' }
        });
        
        if (!commandResponse) {
          throw new ApiError('Command response not found', 404);
        }
        
        responseContent = commandResponse.content;
        break;
    }

    const responseTime = Date.now() - startTime;

    // Track successful execution
    await trackCommandExecution({
      userId: user.id,
      commandName: normalizedCommand,
      responseTimeMs: responseTime,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
      success: true
    });

    // Update user's total commands count
    await prisma.user.update({
      where: { id: user.id },
      data: { totalCommands: { increment: 1 } }
    });

    res.json({
      status: 'success',
      data: {
        command: normalizedCommand,
        response: responseContent,
        responseTime: `${responseTime}ms`,
        downloadInfo,
        user: {
          nickname: user.nickname,
          totalCommands: user.totalCommands + 1
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get response for a specific command
 */
export const getCommandResponse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { commandName } = req.params;
    
    const commandResponse = await prisma.commandResponse.findFirst({
      where: { 
        commandName,
        isActive: true 
      },
      orderBy: { version: 'desc' }
    });

    if (!commandResponse) {
      throw new ApiError('Command response not found', 404);
    }

    res.json({
      status: 'success',
      data: {
        command: commandName,
        response: commandResponse.content,
        contentType: commandResponse.contentType,
        version: commandResponse.version
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Download file (resume)
 */
export const downloadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fileType } = req.params;
    const { sessionId } = req.query as { sessionId: string };
    
    const user = await getUserBySessionId(sessionId);
    if (!user) {
      throw new ApiError('User session not found', 404);
    }

    const fileName = fileType === 'pdf' ? 'wzhenkai_resume.pdf' : 'wzhenkai_resume.md';
    const filePath = path.join(process.cwd(), '..', 'downloads', fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new ApiError('File not found', 404);
    }

    // Track download
    await prisma.fileDownload.create({
      data: {
        userId: user.id,
        fileName,
        fileType,
        ipAddress: req.ip ?? null,
        userAgent: req.get('User-Agent') ?? null,
        success: true
      }
    });

    // Set appropriate headers
    const contentType = fileType === 'pdf' ? 'application/pdf' : 'text/markdown';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Stream file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      logger.error('File download error:', error);
      next(new ApiError('Error downloading file', 500));
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Generate dynamic response (like /help command)
 */
async function generateDynamicResponse(command: string): Promise<string> {
  switch (command) {
    case '/help':
      const commands = await prisma.command.findMany({
        where: { isActive: true },
        select: { name: true, description: true },
        orderBy: { name: 'asc' }
      });
      
      const commandList = commands
        .map(cmd => `${cmd.name.padEnd(25)} - ${cmd.description}`)
        .join('\n');
      
      return `🔧 AVAILABLE COMMANDS

${commandList}

💡 Tips:
• Type '/' to see all commands
• Use arrow keys to navigate suggestions
• Press Tab to autocomplete
• Press Enter to execute

Happy exploring! 🚀`;

    default:
      throw new ApiError('Dynamic response handler not implemented for this command', 500);
  }
}

/**
 * Handle file download commands
 */
async function handleFileDownload(command: string, _userId: string, _ipAddress?: string, _userAgent?: string): Promise<{ message: string; downloadInfo: any }> {
  const fileType = command === '/download-resume-pdf' ? 'pdf' : 'md';
  const fileName = `wzhenkai_resume.${fileType}`;
  
  let message: string;
  if (fileType === 'pdf') {
    message = `📄 DOWNLOADING RESUME (PDF)

Preparing your detailed PDF resume...

📁 File: ${fileName}
📊 Size: Professional & Comprehensive
🎯 Format: ATS-friendly PDF

✅ Download initiated!

This resume includes:
• Complete work experience
• Technical skills breakdown
• Project portfolios
• Education background
• Certifications and achievements

Perfect for HR systems and hiring managers!`;
  } else {
    message = `📝 DOWNLOADING RESUME (MARKDOWN)

Preparing your detailed Markdown resume...

📁 File: ${fileName}
🤖 Format: LLM-friendly Markdown
🎯 Purpose: Perfect for AI analysis

✅ Download initiated!

This markdown version includes:
• Structured data for easy parsing
• Complete technical documentation
• Project details and links
• Machine-readable format

LLMs absolutely love this format! 🤖💕`;
  }

  return {
    message,
    downloadInfo: {
      fileName,
      fileType,
      downloadUrl: `/api/commands/download/${fileType}`
    }
  };
}