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
      return res.status(401).json({ success: false, message: 'Unauthorized - Please login to add judges' });
    }

    // Enhanced admin check - uncomment and customize for your needs
    // const user = await prisma.user.findUnique({ where: { auth0Id: session.user.sub } });
    // if (!user || user.role !== 'ADMIN') {
    //   return res.status(403).json({ success: false, message: 'Admin privileges required to add judges' });
    // }

    const { judgeData, targetCategory } = req.body;

    if (!judgeData) {
      return res.status(400).json({ success: false, message: 'Judge data is required' });
    }

    // Validate required fields
    const requiredFields = ['id', 'name', 'fullName', 'position', 'image'];
    for (const field of requiredFields) {
      if (!judgeData[field]) {
        return res.status(400).json({ 
          success: false, 
          message: `Missing required field: ${field}` 
        });
      }
    }

    // Validate Cloudinary URL
    if (!judgeData.image.includes('cloudinary.com') && !judgeData.image.includes('res.cloudinary.com')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid Cloudinary image URL' 
      });
    }

    // Determine category based on targetCategory
    let category = 'Current Judge';
    let type = 'judge';
    let status = 'current';

    switch (targetCategory) {
      case 'currentChiefJustice':
        category = 'Current Chief Justice';
        type = 'chief-justice';
        status = 'current';
        break;
      case 'currentJudges':
        category = 'Current Judge';
        type = 'judge';
        status = 'current';
        break;
      case 'formerChiefJustices':
        category = 'Former Chief Justice';
        type = 'chief-justice';
        status = 'former';
        break;
      case 'formerJudges':
        category = 'Former Judge';
        type = 'judge';
        status = 'former';
        break;
      default:
        category = 'Current Judge';
        type = 'judge';
        status = 'current';
    }

    // Create judge in MongoDB
    const completeJudgeData = await prisma.judge.create({
      data: {
        name: judgeData.name,
        fullName: judgeData.fullName,
        designation: judgeData.position || 'Judge',
        court: judgeData.court || 'Supreme Court of India',
        photoUrl: judgeData.image,
        appointmentDate: judgeData.appointmentDate || '',
        retirementDate: judgeData.retirementDate || '',
        dateOfBirth: judgeData.dateOfBirth || '',
        education: judgeData.education || [],
        biography: judgeData.biography || '',
        specializations: judgeData.specializations || [],
        careerHighlights: judgeData.careerHighlights || [],
        notableJudgments: judgeData.notableJudgments || [],
        type,
        status,
        category
      }
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Judge added successfully through admin interface',
      judge: completeJudgeData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error adding judge:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}