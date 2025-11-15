import { NextApiRequest, NextApiResponse } from 'next';
import { ManagementClient } from 'auth0';

// Use Management API credentials (M2M app)
const auth0 = new ManagementClient({
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID!,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Send verification email via Auth0
    await auth0.jobs.verifyEmail({
      user_id: userId,
    });

    res.status(200).json({ 
      message: 'Verification email sent successfully',
      success: true 
    });
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ 
      error: error.message || 'Error sending verification email',
      success: false 
    });
  }
}
