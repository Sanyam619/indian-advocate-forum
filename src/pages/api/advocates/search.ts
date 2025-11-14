import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { city } = req.query;

    if (!city || typeof city !== 'string') {
      return res.status(400).json({ message: 'City parameter is required' });
    }

    // Search for advocates in the specified city
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
        isVerified: true,
        createdAt: true,
      },
      orderBy: [
        { isVerified: 'desc' }, // Verified advocates first
        { createdAt: 'desc' }, // Then by registration date
      ],
    });

    // Filter by city - case insensitive comparison
    const filteredAdvocates = advocates.filter(advocate => {
      if (!advocate.city) return false; // Exclude advocates without city
      return advocate.city.toLowerCase() === city.toLowerCase();
    });

    // Transform the data to ensure consistent formatting
    const formattedAdvocates = filteredAdvocates.map(advocate => ({
      ...advocate,
      yearsOfExperience: advocate.yearsOfExperience || '0',
      specialization: advocate.specialization || 'General Practice',
      city: advocate.city || 'Not specified',
      phoneNumber: advocate.phoneNumber || null,
    }));

    return res.status(200).json({
      success: true,
      count: formattedAdvocates.length,
      city: city,
      advocates: formattedAdvocates,
    });
  } catch (error) {
    console.error('Error searching advocates:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error searching advocates',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}