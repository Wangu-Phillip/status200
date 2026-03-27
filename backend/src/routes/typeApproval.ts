import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * Get all type-approved devices with optional search and filtering
 */
router.get('/devices', async (req: any, res: Response) => {
  try {
    const {
      search = '',
      category = '',
      page = '1',
      limit = '10',
    } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Build filter conditions
    const where: any = {
      AND: [],
    };

    // Search across multiple fields
    if (search) {
      where.AND.push({
        OR: [
          {
            deviceName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            manufacturer: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            model: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            certificateNumber: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    // Filter by category
    if (category) {
      where.AND.push({
        category: {
          equals: category,
        },
      });
    }

    // Remove AND if no conditions
    if (where.AND.length === 0) {
      delete where.AND;
    }

    // Get total count for pagination
    const total = await prisma.typeApprovedDevice.count({ where });

    // Fetch devices
    const devices = await prisma.typeApprovedDevice.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: {
        approvalDate: 'desc',
      },
    });

    res.json({
      success: true,
      data: devices,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Error fetching type-approved devices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch type-approved devices',
    });
  }
});

/**
 * Get categories for filtering
 */
router.get('/categories', async (req: any, res: Response) => {
  try {
    const categories = await prisma.typeApprovedDevice.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    res.json({
      success: true,
      data: categories.map((c) => c.category),
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
    });
  }
});

/**
 * Get single device by certificate number
 */
router.get('/devices/:certificateNumber', async (req: any, res: Response) => {
  try {
    const { certificateNumber } = req.params;

    const device = await prisma.typeApprovedDevice.findUnique({
      where: {
        certificateNumber,
      },
    });

    if (!device) {
      res.status(404).json({
        success: false,
        error: 'Device not found',
      });
      return;
    }

    res.json({
      success: true,
      data: device,
    });
  } catch (error: any) {
    console.error('Error fetching device:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch device',
    });
  }
});

export default router;
