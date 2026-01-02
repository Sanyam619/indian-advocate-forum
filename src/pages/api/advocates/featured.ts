import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch advocates with 15+ years of experience
    const advocates = await prisma.user.findMany({
      where: {
        role: 'ADVOCATE',
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
        phoneNumber: true,
        createdAt: true,
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
      take: 200, // Limit to 200 advocates
    });

    // Filter advocates with 15+ years of experience
    const experiencedAdvocates = advocates.filter((advocate) => {
      if (!advocate.yearsOfExperience) return false;
      
      // Extract numeric value from experience string (e.g., "20+ years" -> 20)
      const experienceMatch = advocate.yearsOfExperience.match(/(\d+)/);
      if (!experienceMatch) return false;
      
      const years = parseInt(experienceMatch[1], 10);
      return years >= 15;
    });

    // Transform the data to ensure consistent formatting
    const formattedAdvocates = experiencedAdvocates.map((advocate) => ({
      ...advocate,
      yearsOfExperience: advocate.yearsOfExperience || '0',
      specialization: advocate.specialization || 'General Practice',
      city: advocate.city || 'Not specified',
      phoneNumber: advocate.phoneNumber || null,
    }));

    return res.status(200).json({
      success: true,
      count: formattedAdvocates.length,
      advocates: formattedAdvocates,
    });
  } catch (error) {
    console.error('Error fetching featured advocates:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching featured advocates',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
