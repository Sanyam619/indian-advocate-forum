import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

const planDurations: Record<string, number> = {
  monthly: 30,
  '6months': 180,
  yearly: 365,
  '3years': 1095,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req, res);
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { paymentIntentId, planId } = req.body;

    if (!paymentIntentId || !planId || !planDurations[planId]) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + planDurations[planId]);

    // Update user to premium
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        isPremium: true,
        premiumPlan: planId,
        premiumExpiresAt: expiresAt,
        stripeSubscriptionId: paymentIntentId,
      },
    });

    res.status(200).json({ 
      message: 'Premium subscription activated successfully',
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error activating subscription:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
