import { NextConfig } from 'next';

export const authConfig = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  issuerBaseURL: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}`,
  clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  routes: {
    callback: '/api/auth/callback',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    postLogoutRedirect: '/'
  },
  session: {
    absoluteDuration: 24 * 60 * 60 // 24 hours in seconds
  }
};