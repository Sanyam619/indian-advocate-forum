import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/auth-helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is admin
    const admin = await requireAdmin(req, res);
    if (!admin) return; // Response already sent by requireAdmin

    // Fetch all podcasts with uploader information
    const allPodcasts = await prisma.podcast.findMany({
      include: {
        uploadedBy: {
          select: {
            fullName: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({ 
      success: true, 
      totalPodcasts: allPodcasts.length,
      allPodcasts 
    });
  } catch (error: any) {
    console.error('List podcasts error:', error);
    return res.status(500).json({ error: 'Failed to fetch podcasts' });
  }
}
