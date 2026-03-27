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

export default router;
