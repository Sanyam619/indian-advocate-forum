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

    const { 
      isAdvocate, 
      firstName, 
      lastName, 
      barRegistrationNo, 
      yearsOfExperience, 
      city, 
      specialization,
      bio,
      education,
      languages,
      officeAddress,
      completeSetup 
    } = req.body;

    // Prepare update data
    const capitalizeFirst = (str: string) => 
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    
    const fullName = lastName && lastName.trim()
      ? `${capitalizeFirst(firstName.trim())} ${capitalizeFirst(lastName.trim())}`
      : firstName ? capitalizeFirst(firstName.trim()) : session.user.name;

    const updateData: any = {
      fullName: fullName,
      role: isAdvocate ? 'ADVOCATE' : 'USER',
      barRegistrationNo: isAdvocate ? barRegistrationNo : null,
      yearsOfExperience: isAdvocate ? yearsOfExperience : null,
      city: isAdvocate ? city : null,
    };

    // Add extended advocate fields
    if (isAdvocate) {
      updateData.bio = bio || null;
      updateData.education = education || [];
      updateData.languages = languages || [];
      updateData.officeAddress = officeAddress || null;
      updateData.specialization = specialization || [];
    }

    // Only mark as complete if completeSetup flag is true
    if (completeSetup) {
      updateData.isProfileSetup = true;
      updateData.role = 'ADVOCATE';
    }

    // Update user profile
    const user = await prisma.user.update({
      where: {
        auth0Id: session.user.sub
      },
      data: updateData
    });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Profile setup error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}