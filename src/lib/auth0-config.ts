import { InitAuth0 } from '@auth0/nextjs-auth0';

const config = {
  issuerBaseURL: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}`,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
  clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
  secret: process.env.AUTH0_SECRET || '',
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email'
  },
  routes: {
    callback: '/api/auth/callback',
    login: '/api/auth/login',
    postLogoutRedirect: '/',
    postLoginRedirect: '/home'
  },
  session: {
    absoluteDuration: 24 * 60 * 60, // 24 hours in seconds
    rolling: true,
    rollingDuration: 24 * 60 * 60 // 24 hours in seconds
  },
  httpTimeout: parseInt(process.env.AUTH0_HTTP_TIMEOUT || '10000'), // Configurable timeout
  clockTolerance: parseInt(process.env.AUTH0_CLOCK_TOLERANCE || '60'), // Configurable clock skew
  httpAgent: false // Use default HTTP agent for better connection pooling
};