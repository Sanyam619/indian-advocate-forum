import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export default async function checkAdmin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    return res.status(200).json({ message: 'Authorized' });
  } catch (error) {
    console.error('Check admin error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}