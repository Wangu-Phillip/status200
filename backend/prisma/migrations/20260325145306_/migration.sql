-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "adminNotes" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'Medium',
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" TEXT;
