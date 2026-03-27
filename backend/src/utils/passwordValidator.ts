import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PasswordValidationOptions {
  password: string;
  minLength?: number;
  requireSpecial?: boolean;
}

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

let cachedSettings: any = null;
let settingsCacheTime = 0;

async function getSettings() {
  const now = Date.now();
  // Cache settings for 5 minutes
  if (cachedSettings && (now - settingsCacheTime) < 5 * 60 * 1000) {
    return cachedSettings;
  }

  let settings = await prisma.systemSettings.findFirst();
  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: {
        systemName: 'BOCRA Portal',
        systemDescription: 'Botswana Communications Regulatory Authority Portal',
      }
    });
  }

  cachedSettings = settings;
  settingsCacheTime = now;
  return settings;
}

export async function validatePassword(
  password: string,
  options?: PasswordValidationOptions
): Promise<PasswordValidationResult> {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return { valid: false, errors };
  }

  // Get settings if not provided in options
  let minLength = options?.minLength;
  let requireSpecial = options?.requireSpecial;

  if (minLength === undefined || requireSpecial === undefined) {
    const settings = await getSettings();
    minLength = minLength ?? settings.passwordMinLength;
    requireSpecial = requireSpecial !== undefined ? requireSpecial : settings.passwordRequireSpecial;
  }

  // Check minimum length
  if (minLength && password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  // Check for special characters if required
  if (requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*...)');
  }

  // Always check for at least one uppercase, one lowercase, and one digit
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one digit');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function getPasswordPolicy() {
  const settings = await getSettings();
  return {
    minLength: settings.passwordMinLength,
    requireSpecial: settings.passwordRequireSpecial,
    expiryDays: settings.passwordExpireDays,
    sessionTimeoutMinutes: settings.sessionTimeoutMinutes,
  };
}

export function clearPasswordSettingsCache() {
  cachedSettings = null;
  settingsCacheTime = 0;
}
