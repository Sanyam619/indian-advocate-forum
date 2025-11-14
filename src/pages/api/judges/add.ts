import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import fs from 'fs';
import path from 'path';

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

    // Read current judges data with backup system
    const judgesFilePath = path.join(process.cwd(), 'src/data/judges.json');
    const backupFilePath = path.join(process.cwd(), 'src/data/judges.backup.json');
    
    // Create backup before making changes
    if (fs.existsSync(judgesFilePath)) {
      fs.copyFileSync(judgesFilePath, backupFilePath);
    }
    
    const judgesFileContent = fs.readFileSync(judgesFilePath, 'utf8');
    const judgesData = JSON.parse(judgesFileContent);

    // Set default values for missing optional fields
    const completeJudgeData = {
      type: 'judge',
      status: 'current',
      dateOfBirth: '',
      appointmentDate: '',
      retirementDate: '',
      education: [],
      careerHighlights: [],
      biography: '',
      notableJudgments: [],
      specializations: [],
      ...judgeData
    };

    // Check if judge ID already exists
    const existingJudgeInCurrent = judgesData.currentJudges.find((j: any) => j.id === judgeData.id);
    const existingJudgeInFormer = judgesData.formerJudges?.find((j: any) => j.id === judgeData.id);
    
    if (existingJudgeInCurrent || existingJudgeInFormer) {
      return res.status(400).json({ 
        success: false, 
        message: `Judge with ID '${judgeData.id}' already exists` 
      });
    }

    // Add to appropriate category
    switch (targetCategory) {
      case 'currentChiefJustice':
        judgesData.currentChiefJustice = { ...completeJudgeData, type: 'chief-justice' };
        break;
      case 'currentJudges':
        judgesData.currentJudges.push(completeJudgeData);
        break;
      case 'formerChiefJustices':
        if (!judgesData.formerChiefJustices) {
          judgesData.formerChiefJustices = [];
        }
        judgesData.formerChiefJustices.push({ ...completeJudgeData, type: 'chief-justice', status: 'former' });
        break;
      case 'formerJudges':
        if (!judgesData.formerJudges) {
          judgesData.formerJudges = [];
        }
        judgesData.formerJudges.push({ ...completeJudgeData, status: 'former' });
        break;
      default:
        // Default to current judges
        judgesData.currentJudges.push(completeJudgeData);
    }

    // Validate JSON structure before writing
    if (!judgesData.currentJudges || !Array.isArray(judgesData.currentJudges)) {
      throw new Error('Invalid judges data structure');
    }

    // Write back to file with atomic operation
    const tempFilePath = judgesFilePath + '.tmp';
    fs.writeFileSync(tempFilePath, JSON.stringify(judgesData, null, 2));
    fs.renameSync(tempFilePath, judgesFilePath);

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