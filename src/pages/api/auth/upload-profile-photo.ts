import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb' // Set desired file size limit
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const photoUrl = req.body.photoUrl; // In a real app, you'd handle file upload to a storage service

    // Update user profile with new photo URL
    const updatedUser = await prisma.user.update({
      where: {
        auth0Id: session.user.sub
      },
      data: {
        profilePhoto: photoUrl
      }
    });

    return res.status(200).json({
      photoUrl: updatedUser.profilePhoto
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return res.status(500).json({ error: 'Failed to upload photo' });
  }
}