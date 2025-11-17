import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { ManagementClient } from 'auth0';
import prisma from '../../../lib/prisma';

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
    const { email, firstName, lastName, isAdvocate, barRegistration, experience, paymentIntentId, city, specialization, bio, education, languages, officeAddress } = req.body;
    const fullName = `${firstName} ${lastName || ''}`.trim();

    if (!email || !firstName || !paymentIntentId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create Auth0 user with custom metadata
    const auth0User = await auth0.users.create({
      email,
      password: req.body.password,
      name: fullName,
      email_verified: false, // Require email verification for security
      user_metadata: {
        isAdvocate,
        barRegistration,
        experience,
        paymentIntentId,
        city,
        specialization,
        bio,
        education,
        languages,
        officeAddress,
      },
      app_metadata: {
        role: isAdvocate ? 'ADVOCATE' : 'USER',
      },
      connection: 'Username-Password-Authentication',
    });

    // Create user in your database
    await prisma.user.create({
      data: {
        auth0Id: auth0User.data.user_id!,
        email,
        fullName,
        role: isAdvocate ? 'ADVOCATE' : 'USER',
        // Store advocate-specific fields if user is an advocate
        barRegistrationNo: isAdvocate ? barRegistration : null,
        yearsOfExperience: isAdvocate ? experience : null,
        city: isAdvocate ? city : null,
        specialization: isAdvocate && specialization ? specialization : [],
        bio: isAdvocate ? bio : null,
        education: isAdvocate && education ? education : [],
        languages: isAdvocate && languages ? languages : [],
        officeAddress: isAdvocate ? officeAddress : null,
        isProfileSetup: true,
        // Create payment record
        payments: {
          create: {
            amount: isAdvocate ? 5000 : 1000,
            currency: 'INR',
            status: 'completed',
            stripeId: paymentIntentId,
          },
        },
      },
    });

    res.status(200).json({ message: 'User created successfully' });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message || 'Error creating user' });
  }
}