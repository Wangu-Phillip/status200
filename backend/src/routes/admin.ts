import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken, authorizeAdmin } from '../middleware/auth.js';

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
        res.status(403).json({
          error: 'You only have access to your assigned department',
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
      res.status(500).json({ error: 'Failed to fetch submissions' });
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
          error: 'You only have access to your assigned department',
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

      // Fetch stats from appropriate table based on department
      let total = 0;
      let pending = 0;
      let underReview = 0;
      let approved = 0;
      let rejected = 0;
      let highPriority = 0;

      if (targetDept === 'complaints') {
        total = await prisma.complaint.count({ where: { department: targetDept } });
        pending = await prisma.complaint.count({
          where: { department: targetDept, status: { in: ['Registered', 'Submitted'] } },
        });
        underReview = await prisma.complaint.count({
          where: { department: targetDept, status: 'Under Review' },
        });
        approved = await prisma.complaint.count({
          where: { department: targetDept, status: 'Approved' },
        });
        rejected = await prisma.complaint.count({
          where: { department: targetDept, status: 'Rejected' },
        });
        highPriority = await prisma.complaint.count({
          where: { department: targetDept, priority: 'High' },
        });
      } else if (targetDept === 'tenders') {
        total = await prisma.tender.count({ where: { department: targetDept } });
        pending = await prisma.tender.count({
          where: { department: targetDept, status: 'Submitted' },
        });
        underReview = await prisma.tender.count({
          where: { department: targetDept, status: 'Under Review' },
        });
        approved = await prisma.tender.count({
          where: { department: targetDept, status: 'Approved' },
        });
        rejected = await prisma.tender.count({
          where: { department: targetDept, status: 'Rejected' },
        });
        highPriority = await prisma.tender.count({
          where: { department: targetDept, priority: 'High' },
        });
      } else {
        // licensing and qos use Application table
        total = await prisma.application.count({ where: { department: targetDept } });
        pending = await prisma.application.count({
          where: { department: targetDept, status: 'Submitted' },
        });
        underReview = await prisma.application.count({
          where: { department: targetDept, status: 'Under Review' },
        });
        approved = await prisma.application.count({
          where: { department: targetDept, status: 'Approved' },
        });
        rejected = await prisma.application.count({
          where: { department: targetDept, status: 'Rejected' },
        });
        highPriority = await prisma.application.count({
          where: { department: targetDept, priority: 'High' },
        });
      }

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
          error: 'You only have access to your assigned department',
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
          error: 'You only have access to your assigned department',
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

// =====================
// COMPLAINTS API
// =====================

/**
 * Get complaints
 */
router.get(
  '/complaints',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const where = req.user?.adminLevel === 'admin' ? { department: req.user?.department } : {};

      const complaints = await prisma.complaint.findMany({
        where,
        include: { user: { select: { email: true, name: true } }, documents: true },
        orderBy: { registeredDate: 'desc' },
        skip,
        take: limit,
      });

      const total = await prisma.complaint.count({ where });

      res.json({
        complaints,
        pagination: { page, limit, total },
      });
    } catch (error) {
      console.error('Get complaints error:', error);
      res.status(500).json({ error: 'Failed to fetch complaints' });
    }
  }
);

// =====================
// TENDERS API (User Submissions)
// =====================

/**
 * Get tender submissions
 */
router.get(
  '/tenders',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const where = req.user?.adminLevel === 'admin' ? { department: req.user?.department } : {};

      const tenders = await prisma.tender.findMany({
        where,
        include: { user: { select: { email: true, name: true } }, documents: true },
        orderBy: { submissionDate: 'desc' },
        skip,
        take: limit,
      });

      const total = await prisma.tender.count({ where });

      res.json({
        tenders,
        pagination: { page, limit, total },
      });
    } catch (error) {
      console.error('Get tenders error:', error);
      res.status(500).json({ error: 'Failed to fetch tenders' });
    }
  }
);

// =====================
// SYSTEM SETTINGS API
// =====================

/**
 * Get system settings
 */
router.get(
  '/settings',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      let settings = await prisma.systemSettings.findFirst({
        where: { id: 'default' },
      });

      if (!settings) {
        settings = await prisma.systemSettings.create({
          data: { id: 'default' },
        });
      }

      res.json(settings);
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }
);

/**
 * Update system settings
 */
router.put(
  '/settings',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.adminLevel !== 'superadmin') {
        res.status(403).json({ error: 'Only superadmin can update settings' });
        return;
      }

      const settingsData = req.body;
      const updated = await prisma.systemSettings.upsert({
        where: { id: 'default' },
        update: settingsData,
        create: { ...settingsData, id: 'default' },
      });

      res.json({ message: 'Settings updated successfully', settings: updated });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  }
);

// =====================
// ACTIVITY LOGS API
// =====================

/**
 * Get system-wide activity logs
 */
router.get(
  '/activity-logs',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.adminLevel !== 'superadmin') {
        res.status(403).json({ error: 'Only superadmin can view activity logs' });
        return;
      }

      const limit = Number(req.query.limit) || 25;
      const offset = Number(req.query.offset) || 0;

      const logs = await prisma.activityLog.findMany({
        include: { user: { select: { email: true, name: true } } },
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset,
      });

      const total = await prisma.activityLog.count();

      res.json({ logs, pagination: { total, limit, offset } });
    } catch (error) {
      console.error('Get activity logs error:', error);
      res.status(500).json({ error: 'Failed to fetch activity logs' });
    }
  }
);

// =====================
// TENDER POSTINGS API (For Citizens)
// =====================

/**
 * Get all tender postings
 */
router.get(
  '/tender-postings',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const postings = await prisma.tenderPosting.findMany({
        include: { documents: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      });

      const total = await prisma.tenderPosting.count();

      res.json({ postings, pagination: { page, limit, total } });
    } catch (error) {
      console.error('Get tender postings error:', error);
      res.status(500).json({ error: 'Failed to fetch tender postings' });
    }
  }
);

/**
 * Create new tender posting
 */
router.post(
  '/tender-postings',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const data = req.body;
      const posting = await prisma.tenderPosting.create({
        data: {
          tenderNumber: data.tenderNumber,
          title: data.title,
          category: data.category,
          description: data.description,
          closingDate: new Date(data.closingDate),
          location: data.location || 'Botswana',
          estimatedValue: data.estimatedValue,
          status: data.status || 'Open',
        },
      });

      res.status(201).json(posting);
    } catch (error) {
      console.error('Create tender posting error:', error);
      res.status(500).json({ error: 'Failed to create tender posting' });
    }
  }
);

/**
 * Update tender posting
 */
router.put(
  '/tender-postings/:id',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;

      if (data.closingDate) {
        data.closingDate = new Date(data.closingDate);
      }

      const updated = await prisma.tenderPosting.update({
        where: { id },
        data,
      });

      res.json(updated);
    } catch (error) {
      console.error('Update tender posting error:', error);
      res.status(500).json({ error: 'Failed to update tender posting' });
    }
  }
);

/**
 * Delete tender posting
 */
router.delete(
  '/tender-postings/:id',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.tenderPosting.delete({ where: { id } });
      res.json({ message: 'Tender posting deleted successfully' });
    } catch (error) {
      console.error('Delete tender posting error:', error);
      res.status(500).json({ error: 'Failed to delete tender posting' });
    }
  }
);

/**
 * Add document to tender posting
 */
router.post(
  '/tender-postings/:id/documents',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { name, path } = req.body;

      const document = await prisma.tenderPostingDocument.create({
        data: {
          tenderPostingId: id,
          name,
          path,
        },
      });

      res.status(201).json(document);
    } catch (error) {
      console.error('Add tender document error:', error);
      res.status(500).json({ error: 'Failed to add document' });
    }
  }
);

/**
 * Delete tender document
 */
router.delete(
  '/tender-postings/documents/:id',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.tenderPostingDocument.delete({ where: { id } });
      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Delete tender document error:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  }
);

// =====================
// TYPE APPROVED DEVICES API
// =====================

/**
 * Get all type approved devices
 */
router.get(
  '/devices',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const devices = await prisma.typeApprovedDevice.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      });

      const total = await prisma.typeApprovedDevice.count();

      res.json({ devices, pagination: { page, limit, total } });
    } catch (error) {
      console.error('Get devices error:', error);
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  }
);

/**
 * Create type approved device
 */
router.post(
  '/devices',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const data = req.body;
      const device = await prisma.typeApprovedDevice.create({
        data: {
          ...data,
          approvalDate: new Date(data.approvalDate),
          expiryDate: new Date(data.expiryDate),
        },
      });

      res.status(201).json(device);
    } catch (error) {
      console.error('Create device error:', error);
      res.status(500).json({ error: 'Failed to create device' });
    }
  }
);

export default router;
