-- CreateTable
CREATE TABLE "status_checks" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_checks_pkey" PRIMARY KEY ("id")
);
