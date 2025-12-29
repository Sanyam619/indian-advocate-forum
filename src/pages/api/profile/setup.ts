import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession(req, res);
    
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      firstName,
      lastName,
      phoneNumber,
      city,
      isAdvocate,
      barRegistration,
      experience,
      specialization,
      languages,
      paymentIntentId,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !city) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (isAdvocate && (!barRegistration || !experience)) {
      return res.status(400).json({ message: 'Missing advocate details' });
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { auth0Id: session.user.sub },
      data: {
        fullName: `${firstName} ${lastName}`.trim(),
        phoneNumber: phoneNumber || null,
        city: city,
        role: isAdvocate ? 'ADVOCATE' : 'USER',
        isProfileSetup: true,
        ...(isAdvocate && {
          barRegistrationNo: barRegistration,
          yearsOfExperience: experience.toString(), // Convert to string
          specialization: specialization || [],
          languages: languages || [],
        }),
        // If payment was made, mark as premium
        ...(paymentIntentId && paymentIntentId !== 'test_skip_payment' && {
          isPremium: true,
          premiumExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        }),
      },
    });

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile setup error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
}
