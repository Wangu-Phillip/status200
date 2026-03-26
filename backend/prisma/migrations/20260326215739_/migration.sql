-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "systemName" TEXT NOT NULL DEFAULT 'BOCRA Portal',
    "systemDescription" TEXT NOT NULL DEFAULT 'Botswana Communications Regulatory Authority Portal',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "passwordMinLength" INTEGER NOT NULL DEFAULT 8,
    "passwordRequireSpecial" BOOLEAN NOT NULL DEFAULT true,
    "passwordExpireDays" INTEGER NOT NULL DEFAULT 90,
    "sessionTimeoutMinutes" INTEGER NOT NULL DEFAULT 30,
    "enableTwoFactor" BOOLEAN NOT NULL DEFAULT false,
    "emailNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailOnNewSubmission" BOOLEAN NOT NULL DEFAULT true,
    "emailOnStatusChange" BOOLEAN NOT NULL DEFAULT true,
    "emailOnUserCreation" BOOLEAN NOT NULL DEFAULT true,
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "displayDensity" TEXT NOT NULL DEFAULT 'normal',
    "itemsPerPage" INTEGER NOT NULL DEFAULT 10,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "enableBrowserNotifications" BOOLEAN NOT NULL DEFAULT false,
    "notificationSound" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);
