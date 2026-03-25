import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest, authenticateToken, authorizeSuperAdmin } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /users
 * List all users (superadmin only)
 */
router.get('/', authenticateToken, authorizeSuperAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        adminLevel: true,
        department: true,
        organization: true,
        phone: true,
        address: true,
        tier: true,
        trustScore: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ users, total: users.length });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * GET /users/:id
 * Get a specific user by ID (superadmin only)
 */
router.get('/:id', authenticateToken, authorizeSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        adminLevel: true,
        department: true,
        organization: true,
        phone: true,
        address: true,
        tier: true,
        trustScore: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * POST /users
 * Create a new user (superadmin only)
 */
router.post('/', authenticateToken, authorizeSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const {
      email,
      password,
      name,
      userType,
      adminLevel,
      department,
      organization,
      phone,
      address,
      tier,
      trustScore,
    } = req.body;

    // Validation
    if (!email || !password || !name || !userType) {
      res.status(400).json({
        error: 'Email, password, name, and userType are required',
      });
      return;
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }

    // Validate admin fields
    if (userType === 'admin' && !adminLevel) {
      res.status(400).json({
        error: 'adminLevel is required for admin users',
      });
      return;
    }

    if (adminLevel === 'admin' && !department) {
      res.status(400).json({
        error: 'department is required for department-scoped admins',
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email,
        password: hashedPassword,
        name,
        userType,
        adminLevel: userType === 'admin' ? adminLevel : null,
        department: userType === 'admin' ? department : null,
        organization,
        phone,
        address,
        tier: tier || 'Tier 1 Citizen',
        trustScore: trustScore || 82,
      },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        adminLevel: true,
        department: true,
        organization: true,
        phone: true,
        address: true,
        tier: true,
        trustScore: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * PUT /users/:id
 * Update a user (superadmin only)
 */
router.put('/:id', authenticateToken, authorizeSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password, name, userType, adminLevel, department, organization, phone, address, tier, trustScore } = req.body;

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Prepare update data
    const updateData: any = {};

    if (name) updateData.name = name;
    if (userType) updateData.userType = userType;
    if (adminLevel !== undefined) updateData.adminLevel = adminLevel;
    if (department !== undefined) updateData.department = department;
    if (organization) updateData.organization = organization;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (tier) updateData.tier = tier;
    if (trustScore !== undefined) updateData.trustScore = trustScore;

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Check email uniqueness if changing email
    if (email && email !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email },
      });
      if (existing) {
        res.status(400).json({ error: 'Email already in use' });
        return;
      }
      updateData.email = email;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        adminLevel: true,
        department: true,
        organization: true,
        phone: true,
        address: true,
        tier: true,
        trustScore: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * DELETE /users/:id
 * Delete a user (superadmin only)
 */
router.delete('/:id', authenticateToken, authorizeSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Prevent deleting the last superadmin
    if (user.adminLevel === 'superadmin') {
      const superadminCount = await prisma.user.count({
        where: {
          adminLevel: 'superadmin',
        },
      });

      if (superadminCount <= 1) {
        res.status(400).json({
          error: 'Cannot delete the last superadmin user',
        });
        return;
      }
    }

    // Delete related data first
    await prisma.activityLog.deleteMany({
      where: { userId: id },
    });

    await prisma.document.deleteMany({
      where: { userId: id },
    });

    await prisma.complaint.deleteMany({
      where: { userId: id },
    });

    await prisma.application.deleteMany({
      where: { userId: id },
    });

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: 'User deleted successfully',
      userId: id,
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
