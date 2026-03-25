-- AlterTable
ALTER TABLE "complaints" ADD COLUMN     "adminNotes" TEXT,
ADD COLUMN     "department" TEXT DEFAULT 'complaints',
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" TEXT;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "tenderId" TEXT;

-- CreateTable
CREATE TABLE "tenders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenderNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bidderName" TEXT NOT NULL,
    "bidderEmail" TEXT NOT NULL,
    "bidderPhone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedValue" DOUBLE PRECISION NOT NULL,
    "submittedAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Submitted',
    "department" TEXT DEFAULT 'tenders',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "adminNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenders_tenderNumber_key" ON "tenders"("tenderNumber");

-- AddForeignKey
ALTER TABLE "tenders" ADD CONSTRAINT "tenders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
