import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeSuperAdmin } from '../middleware/auth.js';

const router: Router = express.Router();
const prisma = new PrismaClient();

// GET system settings - for superadmins only
router.get('/', authenticateToken, authorizeSuperAdmin, async (req: Request, res: Response) => {
  try {
    let settings = await prisma.systemSettings.findFirst();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          systemName: 'BOCRA Portal',
          systemDescription: 'Botswana Communications Regulatory Authority Portal',
        }
      });
    }

    // Don't expose certain fields
    const { id, createdAt, ...settingsData } = settings;
    res.json(settingsData);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// UPDATE system settings - for superadmins only
router.put('/', authenticateToken, authorizeSuperAdmin, async (req: Request, res: Response) => {
  try {
    const {
      systemName,
      systemDescription,
      maintenanceMode,
      passwordMinLength,
      passwordRequireSpecial,
      passwordExpireDays,
      sessionTimeoutMinutes,
      enableTwoFactor,
      emailNotificationsEnabled,
      emailOnNewSubmission,
      emailOnStatusChange,
      emailOnUserCreation,
      darkMode,
      displayDensity,
      itemsPerPage,
      notificationsEnabled,
      enableBrowserNotifications,
      notificationSound,
    } = req.body;

    // Validate password settings
    if (passwordMinLength && (passwordMinLength < 6 || passwordMinLength > 20)) {
      return res.status(400).json({ error: 'Password minimum length must be between 6 and 20' });
    }

    if (passwordExpireDays && (passwordExpireDays < 30 || passwordExpireDays > 365)) {
      return res.status(400).json({ error: 'Password expiry days must be between 30 and 365' });
    }

    if (sessionTimeoutMinutes && (sessionTimeoutMinutes < 10 || sessionTimeoutMinutes > 120)) {
      return res.status(400).json({ error: 'Session timeout must be between 10 and 120 minutes' });
    }

    if (itemsPerPage && (itemsPerPage < 5 || itemsPerPage > 50)) {
      return res.status(400).json({ error: 'Items per page must be between 5 and 50' });
    }

    // Get existing settings or create new ones
    let settings = await prisma.systemSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          systemName: systemName || 'BOCRA Portal',
          systemDescription: systemDescription || 'Botswana Communications Regulatory Authority Portal',
          maintenanceMode: maintenanceMode !== undefined ? maintenanceMode : false,
          passwordMinLength: passwordMinLength || 8,
          passwordRequireSpecial: passwordRequireSpecial !== undefined ? passwordRequireSpecial : true,
          passwordExpireDays: passwordExpireDays || 90,
          sessionTimeoutMinutes: sessionTimeoutMinutes || 30,
          enableTwoFactor: enableTwoFactor !== undefined ? enableTwoFactor : false,
          emailNotificationsEnabled: emailNotificationsEnabled !== undefined ? emailNotificationsEnabled : true,
          emailOnNewSubmission: emailOnNewSubmission !== undefined ? emailOnNewSubmission : true,
          emailOnStatusChange: emailOnStatusChange !== undefined ? emailOnStatusChange : true,
          emailOnUserCreation: emailOnUserCreation !== undefined ? emailOnUserCreation : true,
          darkMode: darkMode !== undefined ? darkMode : false,
          displayDensity: displayDensity || 'normal',
          itemsPerPage: itemsPerPage || 10,
          notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : true,
          enableBrowserNotifications: enableBrowserNotifications !== undefined ? enableBrowserNotifications : false,
          notificationSound: notificationSound !== undefined ? notificationSound : true,
        }
      });
    } else {
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: {
          ...(systemName && { systemName }),
          ...(systemDescription && { systemDescription }),
          ...(maintenanceMode !== undefined && { maintenanceMode }),
          ...(passwordMinLength && { passwordMinLength }),
          ...(passwordRequireSpecial !== undefined && { passwordRequireSpecial }),
          ...(passwordExpireDays && { passwordExpireDays }),
          ...(sessionTimeoutMinutes && { sessionTimeoutMinutes }),
          ...(enableTwoFactor !== undefined && { enableTwoFactor }),
          ...(emailNotificationsEnabled !== undefined && { emailNotificationsEnabled }),
          ...(emailOnNewSubmission !== undefined && { emailOnNewSubmission }),
          ...(emailOnStatusChange !== undefined && { emailOnStatusChange }),
          ...(emailOnUserCreation !== undefined && { emailOnUserCreation }),
          ...(darkMode !== undefined && { darkMode }),
          ...(displayDensity && { displayDensity }),
          ...(itemsPerPage && { itemsPerPage }),
          ...(notificationsEnabled !== undefined && { notificationsEnabled }),
          ...(enableBrowserNotifications !== undefined && { enableBrowserNotifications }),
          ...(notificationSound !== undefined && { notificationSound }),
        }
      });
    }

    // Log this action
    if ((req as any).user?.id) {
      await prisma.activityLog.create({
        data: {
          userId: (req as any).user.id,
          action: 'Updated system settings',
          actionType: 'SETTINGS_UPDATE',
          description: `System settings updated by ${(req as any).user.email}`,
          ipAddress: req.ip,
          device: req.headers['user-agent'],
        }
      });
    }

    const { id, createdAt, ...settingsData } = settings;
    res.json(settingsData);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
