import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();

// Helper to verify admin access to department
const verifyDepartmentAccess = (userDepart: string | undefined, requestDepart: string | undefined): boolean => {
  if (!userDepart) return false; // No department assigned
  if (requestDepart && userDepart !== requestDepart) return false; // Different department
  return true;
};

// =====================
// SUBMISSIONS API (for all departments)
// =====================

/**
 * Get submissions filtered by department
 * For department admins: Only their assigned department
 * For superadmin: Filter by department query param or return all
 */
router.get(
  '/submissions',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const department = req.query.department as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Check authorization
      if (
        req.user?.adminLevel === 'admin' &&
        !verifyDepartmentAccess(req.user?.department, department)
      ) {
        res
          .status(403)
          .json({
            error:
              'You only have access to your assigned department',
          });
        return;
      }

      // Build filter
      const where: any = {};
      if (department) {
        where.department = department;
      } else if (req.user?.adminLevel === 'admin') {
        where.department = req.user?.department;
      }

      // Fetch submissions
      const submissions = await prisma.application.findMany({
        where,
        include: { user: { select: { email: true, name: true } }, documents: true },
        orderBy: { submissionDate: 'desc' },
        skip,
        take: limit,
      });

      // Get total count
      const total = await prisma.application.count({ where });

      // Format response
      const formatted = submissions.map((app) => ({
        id: app.referenceNumber,
        token: app.referenceNumber,
        citizenName: app.businessName,
        citizenEmail: app.user.email,
        subject: app.applicationType,
        description: app.description,
        status: app.status,
        priority: app.priority,
        department: app.department,
        submittedDate: app.submissionDate.toLocaleDateString(),
        reviewedBy: app.reviewedBy,
        reviewedAt: app.reviewedAt
          ? new Date(app.reviewedAt).toLocaleDateString()
          : null,
        adminNotes: app.adminNotes,
        documents: app.documents,
      }));

      res.json({
        submissions: formatted,
        pagination: { page, limit, total },
      });
    } catch (error) {
      console.error('Get submissions error:', error);
      res
        .status(500)
        .json({ error: 'Failed to fetch submissions' });
    }
  }
);

/**
 * Get department statistics
 */
router.get(
  '/stats',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const department = req.query.department as string;

      // Check authorization
      if (
        req.user?.adminLevel === 'admin' &&
        !verifyDepartmentAccess(req.user?.department, department)
      ) {
        res.status(403).json({
          error:
            'You only have access to your assigned department',
        });
        return;
      }

      // Determine which department to query
      const targetDept =
        req.user?.adminLevel === 'admin'
          ? req.user?.department
          : department;

      if (!targetDept) {
        res.status(400).json({
          error: 'Department is required',
        });
        return;
      }

      // Fetch stats
      const where = { department: targetDept };

      const total = await prisma.application.count({ where });
      const pending = await prisma.application.count({
        where: { ...where, status: 'Submitted' },
      });
      const underReview = await prisma.application.count({
        where: { ...where, status: 'Under Review' },
      });
      const approved = await prisma.application.count({
        where: {
          ...where,
          status: 'Approved',
        },
      });
      const rejected = await prisma.application.count({
        where: {
          ...where,
          status: 'Rejected',
        },
      });
      const highPriority = await prisma.application.count({
        where: {
          ...where,
          priority: 'High',
        },
      });

      res.json({
        total,
        pending,
        underReview,
        approved,
        rejected,
        highPriority,
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  }
);

/**
 * Update submission status
 */
router.put(
  '/submissions/:referenceNumber/status',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { referenceNumber } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
      }

      // Fetch submission
      const submission = await prisma.application.findUnique({
        where: { referenceNumber },
      });

      if (!submission) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }

      // Check authorization
      if (
        req.user?.adminLevel === 'admin' &&
        submission.department !== req.user?.department
      ) {
        res.status(403).json({
          error:
            'You only have access to your assigned department',
        });
        return;
      }

      // Update submission
      const updated = await prisma.application.update({
        where: { referenceNumber },
        data: {
          status,
          reviewedBy: req.user?.name,
          reviewedAt: new Date(),
          lastUpdated: new Date(),
        },
      });

      res.json({ message: 'Status updated successfully', submission: updated });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  }
);

/**
 * Add admin notes to submission
 */
router.put(
  '/submissions/:referenceNumber/notes',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { referenceNumber } = req.params;
      const { notes } = req.body;

      if (!notes || notes.trim() === '') {
        res.status(400).json({ error: 'Notes cannot be empty' });
        return;
      }

      // Fetch submission
      const submission = await prisma.application.findUnique({
        where: { referenceNumber },
      });

      if (!submission) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }

      // Check authorization
      if (
        req.user?.adminLevel === 'admin' &&
        submission.department !== req.user?.department
      ) {
        res.status(403).json({
          error:
            'You only have access to your assigned department',
        });
        return;
      }

      // Update notes
      const updated = await prisma.application.update({
        where: { referenceNumber },
        data: {
          adminNotes: notes,
          lastUpdated: new Date(),
        },
      });

      res.json({ message: 'Notes added successfully', submission: updated });
    } catch (error) {
      console.error('Add notes error:', error);
      res.status(500).json({ error: 'Failed to add notes' });
    }
  }
);

export default router;
