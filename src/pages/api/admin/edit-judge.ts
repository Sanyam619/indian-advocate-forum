import { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../lib/auth-helpers';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const { judgeId, judgeData } = req.body;

    if (!judgeId) {
      return res.status(400).json({ error: 'Judge ID is required' });
    }

    if (!judgeData) {
      return res.status(400).json({ error: 'Judge data is required' });
    }

    // Validate Cloudinary URL if provided
    if (judgeData.image && !judgeData.image.includes('cloudinary.com') && !judgeData.image.includes('res.cloudinary.com')) {
      return res.status(400).json({ error: 'Please provide a valid Cloudinary image URL' });
    }

    // Update the judge
    const updatedJudge = await prisma.judge.update({
      where: { id: judgeId },
      data: {
        name: judgeData.name,
        fullName: judgeData.fullName,
        designation: judgeData.position || judgeData.designation,
        court: judgeData.court || 'Supreme Court of India',
        photoUrl: judgeData.image || judgeData.photoUrl,
        appointmentDate: judgeData.appointmentDate || null,
        retirementDate: judgeData.retirementDate || null,
        dateOfBirth: judgeData.dateOfBirth || null,
        education: judgeData.education || [],
        biography: judgeData.biography || null,
        specializations: judgeData.specializations || [],
        careerHighlights: judgeData.careerHighlights || [],
        notableJudgments: judgeData.notableJudgments || [],
        type: judgeData.type || 'judge',
        status: judgeData.status || 'current',
        category: judgeData.category || null
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Judge updated successfully',
      judge: updatedJudge
    });

  } catch (error: any) {
    console.error('Error updating judge:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Judge not found' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}
