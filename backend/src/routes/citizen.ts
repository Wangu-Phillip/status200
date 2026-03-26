import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();

// Helper to generate ref numbers
const generateReferenceNumber = (prefix: string) => {
  return `${prefix}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
};

// =====================
// APPLICATIONS ROUTES
// =====================

// Get user applications
router.get('/applications', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = ((Number(page) - 1) * Number(limit)) || 0;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: { documents: true },
      orderBy: { submissionDate: 'desc' },
      skip,
      take: Number(limit),
    });

    const total = await prisma.application.count({ where: { userId } });

    res.json({
      applications,
      total,
      page: Number(page),
      pageSize: Number(limit),
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get single application
router.get('/applications/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    // Verify ownership
    if (application.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Submit new application
router.post('/applications', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { applicationType, businessName, sector, description, department, priority } = req.body;

    if (!applicationType || !businessName || !sector) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const referenceNumber = generateReferenceNumber('APP');

    const application = await prisma.application.create({
      data: {
        id: uuidv4(),
        userId: userId!,
        referenceNumber,
        applicationType,
        businessName,
        sector,
        description: description || '',
        department: department || null,
        priority: priority || 'Medium',
        status: 'Submitted',
      },
      include: { documents: true },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        id: uuidv4(),
        userId: userId!,
        action: 'application_submitted',
        actionType: 'application',
        description: `Submitted application: ${businessName}`,
        entityId: application.id,
        status: 'successful',
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Upload document for application
router.post(
  '/applications/:id/documents',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { documentType, filename } = req.body;

      // Verify application ownership
      const application = await prisma.application.findUnique({
        where: { id },
      });

      if (!application) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      if (application.userId !== userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      const document = await prisma.document.create({
        data: {
          id: uuidv4(),
          userId: userId!,
          applicationId: id,
          filename: filename || 'document',
          category: 'application',
          documentType: documentType || 'submitted',
          status: 'uploaded',
          uploadedDate: new Date(),
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          id: uuidv4(),
          userId: userId!,
          action: 'document_uploaded',
          actionType: 'document',
          description: `Uploaded document: ${filename}`,
          entityId: document.id,
          status: 'successful',
        },
      });

      res.status(201).json(document);
    } catch (error) {
      console.error('Upload document error:', error);
      res.status(500).json({ error: 'Failed to upload document' });
    }
  }
);

// Update application
router.put('/applications/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { businessName, sector, description } = req.body;

    // Verify application ownership
    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    if (application.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    // Only allow editing applications that are not approved or rejected
    if (['Approved', 'Rejected'].includes(application.status)) {
      res.status(400).json({ error: 'Cannot edit applications with final status' });
      return;
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        ...(businessName && { businessName }),
        ...(sector && { sector }),
        ...(description !== undefined && { description }),
      },
      include: { documents: true },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        id: uuidv4(),
        userId: userId!,
        action: 'application_updated',
        actionType: 'application',
        description: `Updated application: ${businessName || application.businessName}`,
        entityId: id,
        status: 'successful',
      },
    });

    res.json(updatedApplication);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Delete application
router.delete('/applications/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    if (application.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    // Only allow deleting applications that are submitted/pending
    if (!['Submitted', 'Pending Review', 'Pending Documents'].includes(application.status)) {
      res.status(400).json({ error: 'Cannot delete applications with final status' });
      return;
    }

    // Delete associated documents
    if (application.documents && application.documents.length > 0) {
      await prisma.document.deleteMany({
        where: { applicationId: id },
      });
    }

    await prisma.application.delete({
      where: { id },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        id: uuidv4(),
        userId: userId!,
        action: 'application_deleted',
        actionType: 'application',
        description: `Deleted application: ${application.businessName}`,
        entityId: id,
        status: 'successful',
      },
    });

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// =====================
// COMPLAINTS ROUTES
// =====================

// Get user complaints
router.get('/complaints', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = ((Number(page) - 1) * Number(limit)) || 0;

    const complaints = await prisma.complaint.findMany({
      where: { userId },
      include: { documents: true },
      orderBy: { registeredDate: 'desc' },
      skip,
      take: Number(limit),
    });

    const total = await prisma.complaint.count({ where: { userId } });

    res.json({
      complaints,
      total,
      page: Number(page),
      pageSize: Number(limit),
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Get single complaint
router.get('/complaints/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!complaint) {
      res.status(404).json({ error: 'Complaint not found' });
      return;
    }

    // Verify ownership
    if (complaint.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    res.json(complaint);
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ error: 'Failed to fetch complaint' });
  }
});

// Submit new complaint
router.post('/complaints', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { complaintType, description, againstOperator, dateOfIncident } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!complaintType || !againstOperator) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const ticketNumber = generateReferenceNumber('COMP');

    const complaint = await prisma.complaint.create({
      data: {
        id: uuidv4(),
        userId: userId!,
        ticketNumber,
        complaintType,
        description: description || '',
        againstOperator,
        dateOfIncident: dateOfIncident ? new Date(dateOfIncident) : new Date(),
        complainantName: user?.name || '',
        complainantEmail: user?.email || '',
        complainantPhone: user?.phone || '',
        status: 'Registered',
      },
      include: { documents: true },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        id: uuidv4(),
        userId: userId!,
        action: 'complaint_filed',
        actionType: 'complaint',
        description: `Filed complaint against ${againstOperator}`,
        entityId: complaint.id,
        status: 'successful',
      },
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Submit complaint error:', error);
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// Update complaint
router.put('/complaints/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { complaintType, description, againstOperator, dateOfIncident } = req.body;

    // Verify complaint ownership
    const complaint = await prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      res.status(404).json({ error: 'Complaint not found' });
      return;
    }

    if (complaint.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    // Only allow editing complaints that are not resolved or closed
    if (['Resolved', 'Closed'].includes(complaint.status)) {
      res.status(400).json({ error: 'Cannot edit resolved or closed complaints' });
      return;
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        ...(complaintType && { complaintType }),
        ...(description !== undefined && { description }),
        ...(againstOperator && { againstOperator }),
        ...(dateOfIncident && { dateOfIncident: new Date(dateOfIncident) }),
      },
      include: { documents: true },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        id: uuidv4(),
        userId: userId!,
        action: 'complaint_updated',
        actionType: 'complaint',
        description: `Updated complaint against ${againstOperator || complaint.againstOperator}`,
        entityId: id,
        status: 'successful',
      },
    });

    res.json(updatedComplaint);
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});

// Delete complaint
router.delete('/complaints/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!complaint) {
      res.status(404).json({ error: 'Complaint not found' });
      return;
    }

    if (complaint.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    // Only allow deleting complaints that are registered or acknowledged
    if (!['Registered', 'Acknowledged'].includes(complaint.status)) {
      res.status(400).json({ error: 'Cannot delete complaints that are in progress or resolved' });
      return;
    }

    // Delete associated documents
    if (complaint.documents && complaint.documents.length > 0) {
      await prisma.document.deleteMany({
        where: { complaintId: id },
      });
    }

    await prisma.complaint.delete({
      where: { id },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        id: uuidv4(),
        userId: userId!,
        action: 'complaint_deleted',
        actionType: 'complaint',
        description: `Deleted complaint against ${complaint.againstOperator}`,
        entityId: id,
        status: 'successful',
      },
    });

    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
});

// =====================
// DOCUMENTS ROUTES
// =====================

// Get user documents
router.get('/documents', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = ((Number(page) - 1) * Number(limit)) || 0;

    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    });

    const total = await prisma.document.count({ where: { userId } });

    // Count by category
    const categories = await prisma.document.groupBy({
      by: ['category'],
      where: { userId },
      _count: true,
    });

    res.json({
      documents,
      total,
      page: Number(page),
      pageSize: Number(limit),
      categories: categories.reduce((acc: any, cat: any) => {
        acc[cat.category] = cat._count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Download document
router.get(
  '/documents/:id/download',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const document = await prisma.document.findUnique({
        where: { id },
      });

      if (!document) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }

      // Verify ownership
      if (document.userId !== userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          id: uuidv4(),
          userId: userId!,
          action: 'document_downloaded',
          actionType: 'document',
          description: `Downloaded document: ${document.filename}`,
          entityId: id,
          status: 'successful',
        },
      });

      res.json({
        message: 'Document download initiated',
        document: {
          id: document.id,
          filename: document.filename,
          downloadUrl: `/documents/${id}/file`, // Mock URL
        },
      });
    } catch (error) {
      console.error('Download document error:', error);
      res.status(500).json({ error: 'Failed to download document' });
    }
  }
);

// Delete document
router.delete(
  '/documents/:id',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const document = await prisma.document.findUnique({
        where: { id },
      });

      if (!document) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }

      // Verify ownership
      if (document.userId !== userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      await prisma.document.delete({
        where: { id },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          id: uuidv4(),
          userId: userId!,
          action: 'document_deleted',
          actionType: 'document',
          description: `Deleted document: ${document.filename}`,
          entityId: id,
          status: 'successful',
        },
      });

      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  }
);

// =====================
// PROFILE ROUTES
// =====================

// Get user profile
router.get('/user/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        tier: true,
        trustScore: true,
        organization: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/user/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, phone, address } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        tier: true,
        trustScore: true,
        organization: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        id: uuidv4(),
        userId: userId!,
        action: 'profile_updated',
        actionType: 'profile',
        description: 'Updated profile information',
        status: 'successful',
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// =====================
// DASHBOARD STATS ROUTES
// =====================

// Get dashboard statistics
router.get('/user/dashboard-stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const [totalApplications, activeComplaints, user] = await Promise.all([
      prisma.application.count({ where: { userId } }),
      prisma.complaint.count({
        where: { userId, status: { not: 'Closed' } },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { trustScore: true },
      }),
    ]);

    // Get recent activity
    const recentActivity = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 5,
    });

    res.json({
      totalApplications,
      activeComplaints,
      nodeTrustScore: user?.trustScore || 82,
      verifiedDevices: 154, // Mock value for now
      recentActivity,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// =====================
// ACTIVITY LOG ROUTES
// =====================

// Get user activity log
router.get('/user/activity', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = ((Number(page) - 1) * Number(limit)) || 0;

    const activities = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      skip,
      take: Number(limit),
    });

    const total = await prisma.activityLog.count({ where: { userId } });

    res.json({
      activities,
      total,
      page: Number(page),
      pageSize: Number(limit),
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to fetch activity log' });
  }
});

// =====================
// SEARCH ROUTES
// =====================

// Global search
router.get('/search', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { query = '', page = 1, limit = 10 } = req.query;
    const skip = ((Number(page) - 1) * Number(limit)) || 0;

    if (!query) {
      res.json({ results: [], total: 0 });
      return;
    }

    const searchTerm = String(query).toLowerCase();

    const [applications, complaints, documents] = await Promise.all([
      prisma.application.findMany({
        where: {
          userId,
          OR: [
            { businessName: { contains: searchTerm, mode: 'insensitive' } },
            { referenceNumber: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        skip,
        take: Number(limit),
      }),
      prisma.complaint.findMany({
        where: {
          userId,
          OR: [
            { ticketNumber: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { againstOperator: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        skip,
        take: Number(limit),
      }),
      prisma.document.findMany({
        where: {
          userId,
          filename: { contains: searchTerm, mode: 'insensitive' },
        },
        skip,
        take: Number(limit),
      }),
    ]);

    const results = [
      ...applications.map((app) => ({
        type: 'application',
        id: app.id,
        title: app.businessName,
        reference: app.referenceNumber,
      })),
      ...complaints.map((comp) => ({
        type: 'complaint',
        id: comp.id,
        title: comp.description.substring(0, 50),
        reference: comp.ticketNumber,
      })),
      ...documents.map((doc) => ({
        type: 'document',
        id: doc.id,
        title: doc.filename,
        reference: doc.id.substring(0, 8),
      })),
    ];

    res.json({
      results: results.slice(0, Number(limit)),
      total: results.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// =====================
// TENDERS ROUTES
// =====================

// Get user tenders
router.get('/tenders', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = ((Number(page) - 1) * Number(limit)) || 0;

    const tenders = await prisma.tender.findMany({
      where: { userId },
      include: { documents: true },
      orderBy: { submissionDate: 'desc' },
      skip,
      take: Number(limit),
    });

    const total = await prisma.tender.count({ where: { userId } });

    res.json({
      tenders,
      total,
      page: Number(page),
      pageSize: Number(limit),
    });
  } catch (error) {
    console.error('Get tenders error:', error);
    res.status(500).json({ error: 'Failed to fetch tenders' });
  }
});

// Get single tender
router.get('/tenders/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const tender = await prisma.tender.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!tender) {
      res.status(404).json({ error: 'Tender not found' });
      return;
    }

    // Verify ownership
    if (tender.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    res.json(tender);
  } catch (error) {
    console.error('Get tender error:', error);
    res.status(500).json({ error: 'Failed to fetch tender' });
  }
});

// Submit new tender
router.post('/tenders', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, bidderName, bidderEmail, bidderPhone, description, estimatedValue, submittedAmount } = req.body;

    if (!title || !bidderName || !bidderEmail) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const tenderNumber = generateReferenceNumber('TND');

    const tender = await prisma.tender.create({
      data: {
        id: uuidv4(),
        userId: userId!,
        tenderNumber,
        title,
        bidderName,
        bidderEmail,
        bidderPhone: bidderPhone || '',
        description: description || '',
        estimatedValue: estimatedValue || 0,
        submittedAmount: submittedAmount || 0,
        status: 'Submitted',
        department: 'tenders',
      },
      include: { documents: true },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        id: uuidv4(),
        userId: userId!,
        action: 'tender_submitted',
        actionType: 'tender',
        description: `Submitted tender: ${title}`,
        entityId: tender.id,
        status: 'successful',
      },
    });

    res.status(201).json(tender);
  } catch (error) {
    console.error('Submit tender error:', error);
    res.status(500).json({ error: 'Failed to submit tender' });
  }
});

// Update tender
router.put('/tenders/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, description, submittedAmount, status } = req.body;

    const tender = await prisma.tender.findUnique({
      where: { id },
    });

    if (!tender) {
      res.status(404).json({ error: 'Tender not found' });
      return;
    }

    if (tender.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const updated = await prisma.tender.update({
      where: { id },
      data: {
        title: title || tender.title,
        description: description || tender.description,
        submittedAmount: submittedAmount !== undefined ? submittedAmount : tender.submittedAmount,
        status: status || tender.status,
        lastUpdated: new Date(),
      },
      include: { documents: true },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update tender error:', error);
    res.status(500).json({ error: 'Failed to update tender' });
  }
});

// Delete tender
router.delete('/tenders/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const tender = await prisma.tender.findUnique({
      where: { id },
    });

    if (!tender) {
      res.status(404).json({ error: 'Tender not found' });
      return;
    }

    if (tender.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await prisma.tender.delete({
      where: { id },
    });

    res.json({ message: 'Tender deleted successfully' });
  } catch (error) {
    console.error('Delete tender error:', error);
    res.status(500).json({ error: 'Failed to delete tender' });
  }
});

// Upload document for tender
router.post(
  '/tenders/:id/documents',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { documentType, filename } = req.body;

      // Verify tender ownership
      const tender = await prisma.tender.findUnique({
        where: { id },
      });

      if (!tender) {
        res.status(404).json({ error: 'Tender not found' });
        return;
      }

      if (tender.userId !== userId) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      const document = await prisma.document.create({
        data: {
          id: uuidv4(),
          tenderId: id,
          userId: userId!,
          filename: filename || 'document',
          category: documentType || 'general',
          documentType: documentType || 'document',
          status: 'uploaded',
          uploadedDate: new Date(),
        },
      });

      res.status(201).json(document);
    } catch (error) {
      console.error('Upload tender document error:', error);
      res.status(500).json({ error: 'Failed to upload document' });
    }
  }
);

export default router;
