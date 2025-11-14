import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, userType, email, fullName } = req.body;

    if (!amount || !userType || !email || !fullName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate amount based on user type
    const expectedAmount = userType === 'advocate' ? 5000 : 1000;
    if (amount !== expectedAmount) {
      return res.status(400).json({ error: 'Invalid amount for user type' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to paise
      currency: 'inr',
      payment_method_types: ['card'], // Only card is enabled in test mode by default
      metadata: {
        userType,
        email,
        fullName,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ error: 'Error creating payment intent' });
  }
}