import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized - Please login to add team members' });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden - Admin access required' });
    }

    const memberData = req.body;

    // Validate required fields
    if (!memberData.name || !memberData.emailId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name and emailId are required' 
      });
    }

    // Validate Cloudinary URL if provided
    if (memberData.profilePhoto && !memberData.profilePhoto.includes('cloudinary.com') && !memberData.profilePhoto.includes('res.cloudinary.com')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid Cloudinary image URL for profile photo' 
      });
    }

    // Create team member in MongoDB
    const teamMember = await prisma.teamMember.create({
      data: {
        barRegistrationNo: memberData.barRegistrationNo || null,
        title: memberData.title || null,
        name: memberData.name,
        emailId: memberData.emailId,
        legalTitle: memberData.legalTitle || null,
        phoneNo: memberData.phoneNo || null,
        yearOfBirth: memberData.yearOfBirth || null,
        placeOfPractice: memberData.placeOfPractice || null,
        address: memberData.address || null,
        enrollment: memberData.enrollment || null,
        webinarPrimaryPreference: memberData.webinarPrimaryPreference || null,
        webinarSecondaryPreference: memberData.webinarSecondaryPreference || null,
        articleContribution: memberData.articleContribution || false,
        references: memberData.references || null,
        profilePhoto: memberData.profilePhoto || null,
        role: memberData.role || 'Member'
      }
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Team member added successfully',
      teamMember,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error adding team member:', error);
    
    // Handle duplicate key errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        success: false, 
        message: 'A team member with this email already exists',
        error: 'Duplicate entry' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
