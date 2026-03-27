import { Router, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * Get available tender postings for public view
 */
router.get('/tender-postings/available', async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 20;

    const postings = await prisma.tenderPosting.findMany({
      where: {
        status: 'Open',
        closingDate: {
          gt: new Date(),
        },
      },
      include: {
        documents: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    res.json({ postings });
  } catch (error) {
    console.error('Get public tender postings error:', error);
    res.status(500).json({ error: 'Failed to fetch tender postings' });
  }
});

/**
 * Get available job openings for public view
 */
router.get('/jobs', async (_req: Request, res: Response) => {
  try {
    const jobs = await prisma.jobPosting.findMany({
      where: {
        status: 'Open',
        closingDate: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json({ jobs });
  } catch (error) {
    console.error('Get public jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch job openings' });
  }
});

/**
 * Get available ISPs for QoS testing
 */
router.get('/isps', (_req: Request, res: Response) => {
  res.json([
    { 
      id: 'btc-fixed', 
      name: 'BTC Fixed Broadband', 
      description: 'Botswana Telecommunications Corporation fixed-line services.',
      regulated_speed_mbps: 50 
    },
    { 
      id: 'btc-mobile', 
      name: 'BTC Mobile (4G/5G)', 
      description: 'BTC mobile data services.',
      regulated_speed_mbps: 20 
    },
    { 
      id: 'mascom-fiber', 
      name: 'Mascom Fiber', 
      description: 'Mascom Wireless high-speed fiber solutions.',
      regulated_speed_mbps: 100 
    },
    { 
      id: 'mascom-mobile', 
      name: 'Mascom Mobile', 
      description: 'Mascom mobile network data.',
      regulated_speed_mbps: 25 
    },
    { 
      id: 'orange-fiber', 
      name: 'Orange Konnect', 
      description: 'Orange Botswana fiber-to-the-home.',
      regulated_speed_mbps: 80 
    },
    { 
      id: 'orange-mobile', 
      name: 'Orange Mobile', 
      description: 'Orange mobile data services.',
      regulated_speed_mbps: 20 
    }
  ]);
});

/**
 * Record a speed test result (Mock implementation)
 */
router.post('/speed-test', (req: Request, res: Response) => {
  const { isp_id, download_speed_mbps, location } = req.body;
  
  console.log(`Recording speed test for ${isp_id} at ${location}: ${download_speed_mbps} Mbps`);
  
  // In a real app, we would save this to the database
  // For now, we return a success response with a unique ID
  res.status(201).json({ 
    id: `ST-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    status: 'recorded',
    timestamp: new Date().toISOString()
  });
});

export default router;
