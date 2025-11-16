import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Only GET method allowed' });
  }

  try {
    console.log('Fetching all judges from database...');
    
    const allJudges = await prisma.judge.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        type: true,
        status: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Total judges in database: ${allJudges.length}`);
    
    // Group by category
    const categoryMap = new Map<string, any[]>();
    
    allJudges.forEach(judge => {
      const category = judge.category || 'NO_CATEGORY';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)?.push(judge);
    });

    const groupedCategories: any = {};
    categoryMap.forEach((judges, category) => {
      groupedCategories[category] = judges;
    });

    // Check for potential issues
    const issues: any[] = [];
    
    allJudges.forEach(judge => {
      if (!judge.category) {
        issues.push({
          type: 'NO_CATEGORY',
          judge: judge.name,
          message: `Judge "${judge.name}" has NO category set`
        });
      } else if (judge.category !== judge.category.trim()) {
        issues.push({
          type: 'EXTRA_SPACES',
          judge: judge.name,
          category: judge.category,
          message: `Judge "${judge.name}" has extra spaces in category`
        });
      }
      
      // Check for case mismatches
      if (judge.category) {
        const expectedCategories = [
          'Current Chief Justice',
          'Current Judge',
          'Former Chief Justice',
          'Former Judge'
        ];
        
        if (!expectedCategories.includes(judge.category)) {
          // Check if it's a case mismatch
          const normalizedCategory = judge.category.toLowerCase();
          const matchingExpected = expectedCategories.find(
            cat => cat.toLowerCase() === normalizedCategory
          );
          
          if (matchingExpected) {
            issues.push({
              type: 'CASE_MISMATCH',
              judge: judge.name,
              currentCategory: judge.category,
              expectedCategory: matchingExpected,
              message: `Judge "${judge.name}" has case mismatch: "${judge.category}" should be "${matchingExpected}"`
            });
          } else {
            issues.push({
              type: 'INVALID_CATEGORY',
              judge: judge.name,
              category: judge.category,
              message: `Judge "${judge.name}" has invalid category: "${judge.category}"`
            });
          }
        }
      }
    });

    return res.status(200).json({ 
      success: true, 
      data: {
        totalJudges: allJudges.length,
        categoryCounts: Object.fromEntries(
          Array.from(categoryMap.entries()).map(([cat, judges]) => [cat, judges.length])
        ),
        groupedCategories,
        issues,
        allJudges: allJudges.map(j => ({
          id: j.id,
          name: j.name,
          category: j.category,
          type: j.type,
          status: j.status
        }))
      }
    });

  } catch (error) {
    console.error('Error reading judges data:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to read judges data',
      error: String(error)
    });
  }
}
