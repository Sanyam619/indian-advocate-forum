import { NextApiRequest, NextApiResponse } from 'next';
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
    const { email, password, firstName, lastName, isAdvocate, barRegistration, experience, paymentIntentId, city, specialization, bio, education, languages, officeAddress } = req.body;
    const fullName = `${firstName} ${lastName || ''}`.trim();

    if (!email || !firstName || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create Auth0 user (same as regular signup but for testing)
    const auth0User = await auth0.users.create({
      email,
      password,
      name: fullName,
      email_verified: true, // Auto-verify for testing only - DO NOT use in production
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

    // Create user in database
    const dbUser = await prisma.user.create({
      data: {
        auth0Id: auth0User.data.user_id!,
        email,
        fullName,
        role: isAdvocate ? 'ADVOCATE' : 'USER',
        barRegistrationNo: isAdvocate ? barRegistration : null,
        yearsOfExperience: isAdvocate ? experience : null,
        city: isAdvocate ? city : null,
        specialization: isAdvocate && specialization ? specialization : [],
        bio: isAdvocate ? bio : null,
        education: isAdvocate && education ? education : [],
        languages: isAdvocate && languages ? languages : [],
        officeAddress: isAdvocate ? officeAddress : null,
        isProfileSetup: true,
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

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Database user created:', {
        id: dbUser.id,
        email: dbUser.email,
        isProfileSetup: dbUser.isProfileSetup,
        role: dbUser.role
      });
    }

    res.status(200).json({ 
      message: 'Test user created successfully',
      note: 'You can now login with your email and password'
    });
  } catch (error: any) {
    console.error('Error creating test user:', error);
    res.status(500).json({ error: error.message || 'Error creating test user' });
  }
}
