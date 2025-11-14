import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

// Disable body parsing, need raw body for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'No signature found' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Error processing webhook:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { email, fullName } = paymentIntent.metadata;

  if (!email) {
    console.error('No email found in payment intent metadata');
    return;
  }

  try {
    // Update user payment status
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      await prisma.user.update({
        where: { email },
        data: {
          isVerified: true,
        },
      });

      // Create payment record
      await prisma.payment.create({
        data: {
          userId: user.id,
          amount: paymentIntent.amount / 100, // Convert from paise to rupees
          currency: paymentIntent.currency.toUpperCase(),
          status: 'completed',
          stripeId: paymentIntent.id,
        },
      });

      console.log(`Payment successful for user: ${email}`);
    } else {
      console.error(`User not found for email: ${email}`);
    }
  } catch (error) {
    console.error('Error updating user payment status:', error);
    throw error;
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const { email } = paymentIntent.metadata;

  if (!email) {
    console.error('No email found in payment intent metadata');
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      await prisma.user.update({
        where: { email },
        data: {
          isVerified: false,
        },
      });

      console.log(`Payment failed for user: ${email}`);
    }
  } catch (error) {
    console.error('Error updating failed payment status:', error);
    throw error;
  }
}
