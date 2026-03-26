import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest, authenticateToken, authorizeSuperAdmin } from '../middleware/auth.js';
import { validatePassword } from '../utils/passwordValidator.js';
import { logUserAction, ACTIVITY_TYPES } from '../utils/activityLogger.js';

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

    // Validate password against security policy
    const passwordValidation = await validatePassword(password);
    if (!passwordValidation.valid) {
      res.status(400).json({
        error: 'Password does not meet security requirements',
        details: passwordValidation.errors,
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

    // Log user creation
    await logUserAction(
      (req as any).user.id,
      `Created new user: ${name} (${email})`,
      ACTIVITY_TYPES.USER_CREATED,
      req.ip,
      req.headers['user-agent'],
      `New ${userType} user created: ${name}`,
      user.id
    );

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
    const changes: string[] = [];

    if (name && name !== user.name) {
      updateData.name = name;
      changes.push(`name: ${user.name} → ${name}`);
    }
    if (userType && userType !== user.userType) {
      updateData.userType = userType;
      changes.push(`userType: ${user.userType} → ${userType}`);
    }
    if (adminLevel !== undefined && adminLevel !== user.adminLevel) {
      updateData.adminLevel = adminLevel;
      changes.push(`adminLevel: ${user.adminLevel} → ${adminLevel}`);
    }
    if (department !== undefined && department !== user.department) {
      updateData.department = department;
      changes.push(`department: ${user.department} → ${department}`);
    }
    if (organization && organization !== user.organization) {
      updateData.organization = organization;
      changes.push(`organization: ${user.organization} → ${organization}`);
    }
    if (phone && phone !== user.phone) {
      updateData.phone = phone;
      changes.push(`phone updated`);
    }
    if (address && address !== user.address) {
      updateData.address = address;
      changes.push(`address updated`);
    }
    if (tier && tier !== user.tier) {
      updateData.tier = tier;
      changes.push(`tier: ${user.tier} → ${tier}`);
    }
    if (trustScore !== undefined && trustScore !== user.trustScore) {
      updateData.trustScore = trustScore;
      changes.push(`trustScore: ${user.trustScore} → ${trustScore}`);
    }

    // Hash password if provided
    if (password) {
      // Validate password
      const passwordValidation = await validatePassword(password);
      if (!passwordValidation.valid) {
        res.status(400).json({
          error: 'Password does not meet security requirements',
          details: passwordValidation.errors,
        });
        return;
      }
      updateData.password = await bcrypt.hash(password, 10);
      changes.push('password changed');
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
      changes.push(`email: ${user.email} → ${email}`);
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

    // Log user update
    if (changes.length > 0) {
      await logUserAction(
        (req as any).user.id,
        `Updated user: ${updatedUser.name} (${updatedUser.email})`,
        ACTIVITY_TYPES.USER_UPDATED,
        req.ip,
        req.headers['user-agent'],
        `Changes: ${changes.join('; ')}`,
        id
      );
    }

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

    // Log user deletion
    await logUserAction(
      (req as any).user.id,
      `Deleted user: ${user.name} (${user.email})`,
      ACTIVITY_TYPES.USER_DELETED,
      req.ip,
      req.headers['user-agent'],
      `User account ${user.email} deleted`,
      id
    );

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
