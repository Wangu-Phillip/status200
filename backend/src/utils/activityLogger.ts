import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface LogActivityOptions {
  userId: string;
  action: string;
  actionType: string;
  description?: string;
  entityId?: string;
  ipAddress?: string;
  device?: string;
  status?: 'successful' | 'failed';
}

export async function logActivity(options: LogActivityOptions) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: options.userId,
        action: options.action,
        actionType: options.actionType,
        description: options.description || '',
        entityId: options.entityId,
        ipAddress: options.ipAddress,
        device: options.device,
        status: options.status || 'successful',
      }
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - activity logging shouldn't break the main operation
  }
}

export async function logUserAction(
  userId: string,
  action: string,
  actionType: string,
  ipAddress?: string,
  device?: string,
  description?: string,
  entityId?: string
) {
  return logActivity({
    userId,
    action,
    actionType,
    description,
    entityId,
    ipAddress,
    device,
  });
}

// Specific activity types
export const ACTIVITY_TYPES = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
  SUBMISSION_CREATED: 'SUBMISSION_CREATED',
  SUBMISSION_UPDATED: 'SUBMISSION_UPDATED',
  SUBMISSION_STATUS_CHANGED: 'SUBMISSION_STATUS_CHANGED',
  SETTINGS_UPDATE: 'SETTINGS_UPDATE',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  ADMIN_NOTES_ADDED: 'ADMIN_NOTES_ADDED',
  DOCUMENT_UPLOADED: 'DOCUMENT_UPLOADED',
  REPORT_GENERATED: 'REPORT_GENERATED',
  TENDER_POSTED: 'TENDER_POSTED',
  TENDER_CLOSED: 'TENDER_CLOSED',
} as const;
