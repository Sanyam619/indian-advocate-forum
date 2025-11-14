import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Only GET method allowed' });
  }

  try {
    const judgesFilePath = path.join(process.cwd(), 'src/data/judges.json');
    
    if (!fs.existsSync(judgesFilePath)) {
      return res.status(404).json({ success: false, message: 'Judges data not found' });
    }

    const judgesFileContent = fs.readFileSync(judgesFilePath, 'utf8');
    const judgesData = JSON.parse(judgesFileContent);

    // Remove the warning fields before sending to client
    const { _warning, _lastModified, _backupLocation, ...cleanData } = judgesData;

    return res.status(200).json({ 
      success: true, 
      data: cleanData,
      message: 'Judges data retrieved successfully'
    });

  } catch (error) {
    console.error('Error reading judges data:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to read judges data' 
    });
  }
}