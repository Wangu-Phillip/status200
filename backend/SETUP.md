# Status200 Backend - Prisma Setup Guide

This is your Node.js/TypeScript backend using **Prisma ORM** with PostgreSQL.

## Prerequisites

- Node.js (v18+)
- PostgreSQL database running
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Update your `.env` file with your database connection:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/status200
PORT=3001
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Create Database and Run Migrations

For the first time setup:

```bash
npm run prisma:migrate:dev
```

This will:

- Create the database schema
- Generate Prisma Client
- Create a migration file

### 5. (Optional) Seed the Database

```bash
npm run prisma:seed
```

### 6. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Available Scripts

| Script                          | Description                              |
| ------------------------------- | ---------------------------------------- |
| `npm run dev`                   | Start development server with hot reload |
| `npm run build`                 | Build TypeScript to JavaScript           |
| `npm start`                     | Run production build                     |
| `npm run prisma:generate`       | Generate Prisma Client                   |
| `npm run prisma:migrate:dev`    | Create and apply migrations (dev)        |
| `npm run prisma:migrate:deploy` | Apply migrations (production)            |
| `npm run prisma:studio`         | Open Prisma Studio (GUI for database)    |
| `npm run prisma:seed`           | Seed database with sample data           |

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Status Checks

- `GET /api/` - Welcome message
- `POST /api/status` - Create a new status check
  - Body: `{ "clientName": "string" }`
- `GET /api/status` - Get all status checks
- `GET /api/status/:id` - Get a specific status check

## Database Schema

The current schema includes the `StatusCheck` model:

```prisma
model StatusCheck {
  id         String   @id @default(uuid())
  clientName String
  timestamp  DateTime @default(now())

  @@map("status_checks")
}
```

## Adding Models

1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:migrate:dev` to create a migration
3. The Prisma Client will automatically regenerate

Example:

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

## Prisma Studio

Open the Prisma Studio GUI to manage your database:

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555`

## Production Deployment

1. Run migrations: `npm run prisma:migrate:deploy`
2. Build: `npm run build`
3. Start: `npm start`

## Troubleshooting

### Connection Error

- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Verify database exists and credentials are correct

### Migration Issues

- Delete `prisma/migrations` folder if needed (dev only)
- Re-run: `npm run prisma:migrate:dev`

### Port Already in Use

- Change `PORT` in `.env`
- Or kill the process: `lsof -i :3001`

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
