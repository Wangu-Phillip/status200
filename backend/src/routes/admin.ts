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

// =====================
// COMPLAINTS API
// =====================

/**
 * Get complaints filtered by department
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

      // Department admins see only their department
      const targetDept =
        req.user?.adminLevel === 'admin'
          ? req.user?.department
          : 'complaints';

      const where = { department: targetDept };

      const complaints = await prisma.complaint.findMany({
        where,
        include: { user: { select: { email: true, name: true } }, documents: true },
        orderBy: { registeredDate: 'desc' },
        skip,
        take: limit,
      });

      const total = await prisma.complaint.count({ where });

      const formatted = complaints.map((comp) => ({
        id: comp.ticketNumber,
        token: comp.ticketNumber,
        citizenName: comp.complainantName,
        citizenEmail: comp.complainantEmail,
        subject: comp.complaintType,
        description: comp.description,
        status: comp.status,
        priority: comp.priority,
        department: comp.department,
        submittedDate: comp.registeredDate.toLocaleDateString(),
        reviewedBy: comp.reviewedBy,
        reviewedAt: comp.reviewedAt
          ? new Date(comp.reviewedAt).toLocaleDateString()
          : null,
        adminNotes: comp.adminNotes,
        documents: comp.documents,
      }));

      res.json({
        complaints: formatted,
        pagination: { page, limit, total },
      });
    } catch (error) {
      console.error('Get complaints error:', error);
      res.status(500).json({ error: 'Failed to fetch complaints' });
    }
  }
);

/**
 * Update complaint status
 */
router.put(
  '/complaints/:ticketNumber/status',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { ticketNumber } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
      }

      const complaint = await prisma.complaint.findUnique({
        where: { ticketNumber },
      });

      if (!complaint) {
        res.status(404).json({ error: 'Complaint not found' });
        return;
      }

      if (
        req.user?.adminLevel === 'admin' &&
        complaint.department !== req.user?.department
      ) {
        res.status(403).json({
          error: 'You only have access to your assigned department',
        });
        return;
      }

      const updated = await prisma.complaint.update({
        where: { ticketNumber },
        data: {
          status,
          reviewedBy: req.user?.name,
          reviewedAt: new Date(),
          lastUpdated: new Date(),
        },
      });

      res.json({ message: 'Status updated successfully', complaint: updated });
    } catch (error) {
      console.error('Update complaint status error:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  }
);

/**
 * Add notes to complaint
 */
router.put(
  '/complaints/:ticketNumber/notes',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { ticketNumber } = req.params;
      const { notes } = req.body;

      if (!notes || notes.trim() === '') {
        res.status(400).json({ error: 'Notes cannot be empty' });
        return;
      }

      const complaint = await prisma.complaint.findUnique({
        where: { ticketNumber },
      });

      if (!complaint) {
        res.status(404).json({ error: 'Complaint not found' });
        return;
      }

      if (
        req.user?.adminLevel === 'admin' &&
        complaint.department !== req.user?.department
      ) {
        res.status(403).json({
          error: 'You only have access to your assigned department',
        });
        return;
      }

      const updated = await prisma.complaint.update({
        where: { ticketNumber },
        data: {
          adminNotes: notes,
          lastUpdated: new Date(),
        },
      });

      res.json({ message: 'Notes added successfully', complaint: updated });
    } catch (error) {
      console.error('Add complaint notes error:', error);
      res.status(500).json({ error: 'Failed to add notes' });
    }
  }
);

// =====================
// TENDERS API
// =====================

/**
 * Get tenders filtered by department
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

      // Department admins see only their department
      const targetDept =
        req.user?.adminLevel === 'admin'
          ? req.user?.department
          : 'tenders';

      const where = { department: targetDept };

      const tenders = await prisma.tender.findMany({
        where,
        include: { user: { select: { email: true, name: true } }, documents: true },
        orderBy: { submissionDate: 'desc' },
        skip,
        take: limit,
      });

      const total = await prisma.tender.count({ where });

      const formatted = tenders.map((tender) => ({
        id: tender.tenderNumber,
        token: tender.tenderNumber,
        citizenName: tender.bidderName,
        citizenEmail: tender.bidderEmail,
        subject: tender.title,
        description: tender.description,
        status: tender.status,
        priority: tender.priority,
        department: tender.department,
        submittedDate: tender.submissionDate.toLocaleDateString(),
        reviewedBy: tender.reviewedBy,
        reviewedAt: tender.reviewedAt
          ? new Date(tender.reviewedAt).toLocaleDateString()
          : null,
        adminNotes: tender.adminNotes,
        documents: tender.documents,
        estimatedValue: tender.estimatedValue,
        submittedAmount: tender.submittedAmount,
      }));

      res.json({
        tenders: formatted,
        pagination: { page, limit, total },
      });
    } catch (error) {
      console.error('Get tenders error:', error);
      res.status(500).json({ error: 'Failed to fetch tenders' });
    }
  }
);

/**
 * Update tender status
 */
router.put(
  '/tenders/:tenderNumber/status',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { tenderNumber } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
      }

      const tender = await prisma.tender.findUnique({
        where: { tenderNumber },
      });

      if (!tender) {
        res.status(404).json({ error: 'Tender not found' });
        return;
      }

      if (
        req.user?.adminLevel === 'admin' &&
        tender.department !== req.user?.department
      ) {
        res.status(403).json({
          error: 'You only have access to your assigned department',
        });
        return;
      }

      const updated = await prisma.tender.update({
        where: { tenderNumber },
        data: {
          status,
          reviewedBy: req.user?.name,
          reviewedAt: new Date(),
          lastUpdated: new Date(),
        },
      });

      res.json({ message: 'Status updated successfully', tender: updated });
    } catch (error) {
      console.error('Update tender status error:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  }
);

/**
 * Add notes to tender
 */
router.put(
  '/tenders/:tenderNumber/notes',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { tenderNumber } = req.params;
      const { notes } = req.body;

      if (!notes || notes.trim() === '') {
        res.status(400).json({ error: 'Notes cannot be empty' });
        return;
      }

      const tender = await prisma.tender.findUnique({
        where: { tenderNumber },
      });

      if (!tender) {
        res.status(404).json({ error: 'Tender not found' });
        return;
      }

      if (
        req.user?.adminLevel === 'admin' &&
        tender.department !== req.user?.department
      ) {
        res.status(403).json({
          error: 'You only have access to your assigned department',
        });
        return;
      }

      const updated = await prisma.tender.update({
        where: { tenderNumber },
        data: {
          adminNotes: notes,
          lastUpdated: new Date(),
        },
      });

      res.json({ message: 'Notes added successfully', tender: updated });
    } catch (error) {
      console.error('Add tender notes error:', error);
      res.status(500).json({ error: 'Failed to add notes' });
    }
  }
);

// =====================
// TENDER POSTINGS API (Admin-created tenders for citizens)
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
      const status = req.query.status as string;

      const where: any = {};
      if (status) where.status = status;

      const postings = await prisma.tenderPosting.findMany({
        where,
        include: {
          documents: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.tenderPosting.count({ where });

      res.json({
        postings,
        total,
        page,
        pages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('Get tender postings error:', error);
      res.status(500).json({ error: 'Failed to fetch tender postings' });
    }
  }
);

/**
 * Create a new tender posting
 */
router.post(
  '/tender-postings',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { 
        tenderNumber, 
        title, 
        description, 
        category, 
        estimatedValue,
        closingDate,
        location
      } = req.body;

      if (!tenderNumber || !title || !description || !category || !closingDate) {
        res.status(400).json({ 
          error: 'Missing required fields: tenderNumber, title, description, category, closingDate' 
        });
        return;
      }

      // Check if tenderNumber already exists
      const existing = await prisma.tenderPosting.findUnique({
        where: { tenderNumber },
      });

      if (existing) {
        res.status(400).json({ error: 'Tender number already exists' });
        return;
      }

      const posting = await prisma.tenderPosting.create({
        data: {
          tenderNumber,
          title,
          description,
          category,
          estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
          closingDate: new Date(closingDate),
          location: location || null,
          createdBy: req.user!.id,
          lastUpdatedBy: req.user!.id,
        },
        include: {
          documents: true,
        },
      });

      res.status(201).json({
        message: 'Tender posting created successfully',
        posting,
      });
    } catch (error) {
      console.error('Create tender posting error:', error);
      res.status(500).json({ error: 'Failed to create tender posting' });
    }
  }
);

/**
 * Update a tender posting
 */
router.put(
  '/tender-postings/:id',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, status, category, estimatedValue, closingDate, location, adminNotes } = req.body;

      const posting = await prisma.tenderPosting.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(status && { status }),
          ...(category && { category }),
          ...(estimatedValue && { estimatedValue: parseFloat(estimatedValue) }),
          ...(closingDate && { closingDate: new Date(closingDate) }),
          ...(location !== undefined && { location }),
          ...(adminNotes && { adminNotes }),
          lastUpdatedBy: req.user!.id,
          updatedAt: new Date(),
        },
        include: {
          documents: true,
        },
      });

      res.json({
        message: 'Tender posting updated successfully',
        posting,
      });
    } catch (error) {
      console.error('Update tender posting error:', error);
      res.status(500).json({ error: 'Failed to update tender posting' });
    }
  }
);

/**
 * Delete a tender posting
 */
router.delete(
  '/tender-postings/:id',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      await prisma.tenderPosting.delete({
        where: { id },
      });

      res.json({ message: 'Tender posting deleted successfully' });
    } catch (error) {
      console.error('Delete tender posting error:', error);
      res.status(500).json({ error: 'Failed to delete tender posting' });
    }
  }
);

/**
 * Get documents for a tender posting
 */
router.get(
  '/tender-postings/:id/documents',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const documents = await prisma.tenderDocument.findMany({
        where: { tenderPostingId: id },
        orderBy: { uploadedDate: 'desc' },
      });

      res.json({ documents });
    } catch (error) {
      console.error('Get tender documents error:', error);
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  }
);

/**
 * Upload a document to a tender posting
 */
router.post(
  '/tender-postings/:id/documents',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { filename, fileType, filePath, fileSize } = req.body;

      if (!filename || !fileType || !filePath || fileSize === undefined) {
        res.status(400).json({ 
          error: 'Missing required fields: filename, fileType, filePath, fileSize' 
        });
        return;
      }

      // Verify tender posting exists
      const posting = await prisma.tenderPosting.findUnique({
        where: { id },
      });

      if (!posting) {
        res.status(404).json({ error: 'Tender posting not found' });
        return;
      }

      const document = await prisma.tenderDocument.create({
        data: {
          tenderPostingId: id,
          filename,
          fileType,
          filePath,
          fileSize: parseInt(fileSize),
          uploadedBy: req.user!.id,
        },
      });

      res.status(201).json({
        message: 'Document uploaded successfully',
        document,
      });
    } catch (error) {
      console.error('Upload tender document error:', error);
      res.status(500).json({ error: 'Failed to upload document' });
    }
  }
);

/**
 * Delete a tender document
 */
router.delete(
  '/tender-documents/:documentId',
  authenticateToken,
  authorizeAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { documentId } = req.params;

      await prisma.tenderDocument.delete({
        where: { id: documentId },
      });

      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Delete tender document error:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  }
);

export default router;
