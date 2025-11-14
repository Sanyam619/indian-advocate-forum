declare namespace NodeJS {
  interface ProcessEnv {
    // Auth0
    NEXT_PUBLIC_AUTH0_DOMAIN: string
    NEXT_PUBLIC_AUTH0_CLIENT_ID: string
    AUTH0_CLIENT_SECRET: string
    AUTH0_SECRET: string
    NEXT_PUBLIC_BASE_URL: string

    // Database
    DATABASE_URL: string

    // Stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
    STRIPE_SECRET_KEY: string
    STRIPE_WEBHOOK_SECRET: string

    // Zoom
    ZOOM_ACCOUNT_ID: string
    ZOOM_CLIENT_ID: string
    ZOOM_CLIENT_SECRET: string

    // Cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
  }
}