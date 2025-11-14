import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { fullName, barRegistrationNo, bio, education, officeAddress } = req.body;

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        auth0Id: session.user.sub
      },
      data: {
        fullName,
        ...(barRegistrationNo !== undefined && { barRegistrationNo }),
        ...(bio !== undefined && { bio }),
        ...(education !== undefined && { education }),
        ...(officeAddress !== undefined && { officeAddress }),
      } as any
    });

    return res.status(200).json({
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      role: updatedUser.role,
      barRegistrationNo: (updatedUser as any).barRegistrationNo,
      yearsOfExperience: (updatedUser as any).yearsOfExperience,
      profilePhoto: updatedUser.profilePhoto,
      isProfileSetup: (updatedUser as any).isProfileSetup,
      bio: (updatedUser as any).bio,
      education: (updatedUser as any).education,
      officeAddress: (updatedUser as any).officeAddress,
      city: (updatedUser as any).city,
      specialization: (updatedUser as any).specialization,
      languages: (updatedUser as any).languages,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}