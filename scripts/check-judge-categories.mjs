import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkJudgeCategories() {
  try {
    console.log('Fetching all judges from database...\n');
    
    const allJudges = await prisma.judge.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        type: true,
        status: true,
      }
    });

    console.log(`Total judges in database: ${allJudges.length}\n`);
    
    // Group by category
    const categoryMap = new Map();
    
    allJudges.forEach(judge => {
      const category = judge.category || 'NO_CATEGORY';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category).push(judge);
    });

    console.log('Judges grouped by category:\n');
    categoryMap.forEach((judges, category) => {
      console.log(`Category: "${category}" (${judges.length} judges)`);
      judges.forEach(judge => {
        console.log(`  - ${judge.name} (type: ${judge.type}, status: ${judge.status})`);
      });
      console.log('');
    });

    // Check for potential issues
    console.log('\n=== POTENTIAL ISSUES ===\n');
    
    const issues = [];
    
    allJudges.forEach(judge => {
      if (!judge.category) {
        issues.push(`❌ Judge "${judge.name}" has NO category set`);
      } else if (judge.category !== judge.category.trim()) {
        issues.push(`❌ Judge "${judge.name}" has extra spaces in category: "${judge.category}"`);
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
            issues.push(`⚠️  Judge "${judge.name}" has case mismatch: "${judge.category}" should be "${matchingExpected}"`);
          } else {
            issues.push(`❌ Judge "${judge.name}" has invalid category: "${judge.category}"`);
          }
        }
      }
    });

    if (issues.length === 0) {
      console.log('✅ No issues found! All categories are correctly set.\n');
    } else {
      issues.forEach(issue => console.log(issue));
      console.log('');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkJudgeCategories();
