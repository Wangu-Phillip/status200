import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeSuperAdmin } from '../middleware/auth.js';

const router: Router = express.Router();
const prisma = new PrismaClient();

// GET recent activities - for superadmins only
router.get('/', authenticateToken, authorizeSuperAdmin, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: limit,
        skip: offset,
      }),
      prisma.activityLog.count()
    ]);

    // Transform activity data for frontend
    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      action: activity.action,
      actionType: activity.actionType,
      user: activity.user.email,
      userName: activity.user.name,
      description: activity.description,
      entityId: activity.entityId,
      ipAddress: activity.ipAddress,
      device: activity.device,
      status: activity.status,
      timestamp: activity.timestamp,
    }));

    res.json({
      activities: formattedActivities,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// GET activity by type
router.get('/type/:actionType', authenticateToken, authorizeSuperAdmin, async (req: Request, res: Response) => {
  try {
    const { actionType } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    const activities = await prisma.activityLog.findMany({
      where: {
        actionType: actionType
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit,
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities by type:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// GET activity stats
router.get('/stats', authenticateToken, authorizeSuperAdmin, async (req: Request, res: Response) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [total, last24h, last7d, byType] = await Promise.all([
      prisma.activityLog.count(),
      prisma.activityLog.count({
        where: {
          timestamp: {
            gte: last24Hours
          }
        }
      }),
      prisma.activityLog.count({
        where: {
          timestamp: {
            gte: last7Days
          }
        }
      }),
      prisma.activityLog.groupBy({
        by: ['actionType'],
        _count: true,
        orderBy: {
          _count: {
            actionType: 'desc'
          }
        }
      })
    ]);

    res.json({
      total,
      last24Hours: last24h,
      last7Days: last7d,
      byType: byType.map(item => ({
        type: item.actionType,
        count: item._count
      }))
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({ error: 'Failed to fetch activity stats' });
  }
});

export default router;
