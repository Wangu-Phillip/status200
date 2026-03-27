import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validatePassword } from '../utils/passwordValidator.js';
import { logUserAction, ACTIVITY_TYPES } from '../utils/activityLogger.js';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
    name: string;
    organization?: string;
    userType: 'admin' | 'client';
    department?: string;
  };
}

interface AuthRequest extends Request {
  headers: {
    authorization?: string;
  };
}

// Login route
router.post('/login', async (req: LoginRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Log failed login attempt
      await logUserAction(user.id, 'Failed login attempt', ACTIVITY_TYPES.USER_LOGIN, req.ip, req.headers['user-agent'], 'Failed login', undefined);
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        userType: user.userType,
        adminLevel: user.adminLevel,
        name: user.name,
        department: user.department,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Log successful login
    await logUserAction(user.id, 'User logged in', ACTIVITY_TYPES.USER_LOGIN, req.ip, req.headers['user-agent']);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        adminLevel: user.adminLevel,
        organization: user.organization,
        department: user.department,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Provide a development fallback if DB is unreachable
    if (process.env.NODE_ENV !== 'production' && (error.code === 'P1001' || error.message.includes('Prisma'))) {
      console.warn('⚠️ Database unreachable. Using development fallback user for citizen@example.com');
      
      const mockUser = {
        id: 'dev-citizen-id',
        email: 'citizen@example.com',
        name: 'John Doe (Dev)',
        userType: 'client',
        organization: 'Mock Corp'
      };

      const token = jwt.sign(mockUser, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: mockUser });
      return;
    }
    
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Register route
router.post('/register', async (req: RegisterRequest, res: Response) => {
  try {
    const { email, password, name, organization, userType, department } = req.body;

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
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        userType,
        organization,
        department: userType === 'admin' ? department : null,
      },
    });

    // Log user creation
    await logUserAction(user.id, 'User account created', ACTIVITY_TYPES.USER_CREATED, req.ip, req.headers['user-agent']);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        userType: user.userType,
        name: user.name,
        department: user.department,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        organization: user.organization,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Validate token route
router.post('/validate', async (req: AuthRequest, res: Response) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid token' });
      return;
    }

    const token = authorization.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Get fresh user data from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
          adminLevel: user.adminLevel,
          organization: user.organization,
          department: user.department,
        },
      });
    } catch (tokenError) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Validate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
