export class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

export function validateEnvironment() {
  try {
    // Skip validation on server-side during build or if running in test environment
    if (typeof window === 'undefined' && (process.env.NODE_ENV === 'test' || process.env.NEXT_PHASE === 'phase-production-build')) {
      return true;
    }

  const requiredVars = {
    // Auth0
    auth0: [
      'NEXT_PUBLIC_AUTH0_DOMAIN',
      'NEXT_PUBLIC_AUTH0_CLIENT_ID',
      'AUTH0_CLIENT_SECRET',
      'AUTH0_SECRET',
      'NEXT_PUBLIC_BASE_URL'
    ],
    // Database
    database: ['DATABASE_URL'],
    // Stripe
    stripe: [
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY'
      // 'STRIPE_WEBHOOK_SECRET' - Optional for now
    ],
    // Zoom
    zoom: [
      'ZOOM_ACCOUNT_ID',
      'ZOOM_CLIENT_ID',
      'ZOOM_CLIENT_SECRET'
    ],
    // Cloudinary
    cloudinary: [
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ]
  };

  const missing: { [key: string]: string[] } = {};

  // Check each category
  for (const [category, vars] of Object.entries(requiredVars)) {
    const missingVars = vars.filter(varName => {
      const value = process.env[varName];
      return !value || value.trim() === '';
    });
    if (missingVars.length > 0) {
      missing[category] = missingVars;
    }
  }

  // If any variables are missing, log warning instead of throwing error in development
  if (Object.keys(missing).length > 0) {
    const errorMessage = Object.entries(missing)
      .map(([category, vars]) => `${category}: ${vars.join(', ')}`)
      .join('\n');
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Missing environment variables (development mode):\n', errorMessage);
      return false; // Return false but don't throw error
    } else {
      throw new EnvironmentError(`Missing required environment variables:\n${errorMessage}`);
    }
  }

  // Validate URL formats - only in production or if variables exist
  if (process.env.NEXT_PUBLIC_BASE_URL && !/^https?:\/\//.test(process.env.NEXT_PUBLIC_BASE_URL)) {
    const message = 'NEXT_PUBLIC_BASE_URL must be a valid URL starting with http:// or https://';
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️', message);
    } else {
      throw new EnvironmentError(message);
    }
  }

  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('mongodb')) {
    const message = 'DATABASE_URL must be a valid MongoDB connection string';
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️', message);
    } else {
      throw new EnvironmentError(message);
    }
  }

  // Validate Auth0 domain format
  if (process.env.NEXT_PUBLIC_AUTH0_DOMAIN && !/^[a-zA-Z0-9-]+\.(auth0\.com|us\.auth0\.com)$/.test(process.env.NEXT_PUBLIC_AUTH0_DOMAIN)) {
    const message = 'NEXT_PUBLIC_AUTH0_DOMAIN must be a valid Auth0 domain';
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️', message);
    } else {
      throw new EnvironmentError(message);
    }
  }

  // Validate Stripe key formats
  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !/^pk_(test|live)_/.test(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)) {
    const message = 'Invalid Stripe publishable key format';
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️', message);
    } else {
      throw new EnvironmentError(message);
    }
  }

  if (process.env.STRIPE_SECRET_KEY && !/^sk_(test|live)_/.test(process.env.STRIPE_SECRET_KEY)) {
    const message = 'Invalid Stripe secret key format';
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️', message);
    } else {
      throw new EnvironmentError(message);
    }
  }

  // Webhook secret validation disabled temporarily
  // if (process.env.STRIPE_WEBHOOK_SECRET && !/^whsec_/.test(process.env.STRIPE_WEBHOOK_SECRET)) {
  //   throw new EnvironmentError('Invalid Stripe webhook secret format');
  // }

    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Environment validation failed (development mode):', error instanceof Error ? error.message : error);
      return false;
    } else {
      throw error;
    }
  }
}