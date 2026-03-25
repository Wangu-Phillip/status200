import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import citizenRoutes from './routes/citizen.js';

// Setup environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app: Express = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['*'],
  })
);

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Basic health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
const apiRouter = express.Router({ strict: false });

// Root endpoint
apiRouter.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
});

// Auth routes
apiRouter.use('/auth', authRoutes);

// Citizen routes (protected)
apiRouter.use('/', citizenRoutes);

// Create status check
apiRouter.post('/status', async (req: Request, res: Response) => {
  try {
    const { clientName } = req.body;

    if (!clientName) {
      res.status(400).json({ error: 'clientName is required' });
      return;
    }

    const statusCheck = await prisma.statusCheck.create({
      data: {
        id: uuidv4(),
        clientName,
      },
    });

    res.status(201).json(statusCheck);
  } catch (error) {
    console.error('Error creating status check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all status checks
apiRouter.get('/status', async (_req: Request, res: Response) => {
  try {
    const statusChecks = await prisma.statusCheck.findMany({
      orderBy: { timestamp: 'desc' },
    });

    res.json(statusChecks);
  } catch (error) {
    console.error('Error fetching status checks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single status check by ID
apiRouter.get('/status/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const statusCheck = await prisma.statusCheck.findUnique({
      where: { id },
    });

    if (!statusCheck) {
      res.status(404).json({ error: 'Status check not found' });
      return;
    }

    res.json(statusCheck);
  } catch (error) {
    console.error('Error fetching status check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mount API router with /api prefix
app.use('/api', apiRouter);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT NOW()`;
    console.log('Database connection established');

    app.listen(PORT, () => {
      console.log(
        `[${new Date().toISOString()}] Server is running on http://localhost:${PORT}`
      );
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
