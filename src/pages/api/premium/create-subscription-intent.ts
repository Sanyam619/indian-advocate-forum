import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

const planPrices: Record<string, number> = {
  monthly: 199,
  '6months': 999,
  yearly: 1799,
  '3years': 3999,
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

    const { planId, amount } = req.body;

    // Validate plan and amount
    if (!planId || !planPrices[planId]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    if (amount !== planPrices[planId]) {
      return res.status(400).json({ error: 'Invalid amount for selected plan' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to paise
      currency: 'inr',
      payment_method_types: ['card'], // Only card is enabled in test mode by default
      metadata: {
        userId: session.user.sub,
        email: session.user.email,
        planId: planId,
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating subscription payment intent:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
