import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Advocate ID is required' });
    }

    // Fetch advocate by ID
    const advocate = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        profilePhoto: true,
        barRegistrationNo: true,
        yearsOfExperience: true,
        specialization: true,
        city: true,
        role: true,
        createdAt: true,
        // Additional fields for full profile
        bio: true,
        education: true,
        languages: true,
        officeAddress: true,
      },
    });

    if (!advocate) {
      return res.status(404).json({ 
        success: false,
        message: 'Advocate not found' 
      });
    }

    // Check if user is an advocate
    if (advocate.role !== 'ADVOCATE') {
      return res.status(404).json({ 
        success: false,
        message: 'Profile not found' 
      });
    }

    // Format the response
    const formattedAdvocate = {
      ...advocate,
      yearsOfExperience: advocate.yearsOfExperience || '0',
      specialization: advocate.specialization || [],
      city: advocate.city || 'Not specified',
      bio: advocate.bio || '',
      education: advocate.education || [],
      languages: advocate.languages || [],
      officeAddress: advocate.officeAddress || '',
    };

    return res.status(200).json({
      success: true,
      advocate: formattedAdvocate,
    });
  } catch (error) {
    console.error('Error fetching advocate:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching advocate profile',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
