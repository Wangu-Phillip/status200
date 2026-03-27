-- CreateTable
CREATE TABLE "type_approved_devices" (
    "id" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "approvalDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "standards" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "frequency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "type_approved_devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "type_approved_devices_certificateNumber_key" ON "type_approved_devices"("certificateNumber");
