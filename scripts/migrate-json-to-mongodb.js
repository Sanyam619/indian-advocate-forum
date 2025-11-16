/**
 * Migration script to import news and judges from deleted JSON files into MongoDB
 * Run: node scripts/migrate-json-to-mongodb.js
 */

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

// Court names mapping
const courtFiles = [
  'allahabad-high-court',
  'andhra-pradesh-high-court',
  'bombay-high-court',
  'calcutta-high-court',
  'chhattisgarh-high-court',
  'delhi-high-court',
  'gauhati-high-court',
  'gujarat-high-court',
  'himachal-pradesh-high-court',
  'jammu-kashmir-ladakh-high-court',
  'jharkhand-high-court',
  'karnataka-high-court',
  'kerala-high-court',
  'madhya-pradesh-high-court',
  'madras-high-court',
  'manipur-high-court',
  'meghalaya-high-court',
  'orissa-high-court',
  'patna-high-court',
  'punjab-haryana-high-court',
  'rajasthan-high-court',
  'sikkim-high-court',
  'telangana-high-court',
  'tripura-high-court',
  'uttarakhand-high-court',
  'supreme-court'
];

async function getJSONFromGit(filePath) {
  try {
    const content = execSync(
      `git show 55da3a5^:${filePath}`,
      { encoding: 'utf-8' }
    );
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error fetching ${filePath}:`, error.message);
    return null;
  }
}

async function migrateNews() {
  console.log('\n📰 Migrating News Articles...\n');
  
  // Get admin user for authorId
  const adminUser = await prisma.user.findFirst({
    where: { email: 'sanyamgupta998@gmail.com' }
  });

  if (!adminUser) {
    console.error('❌ Admin user not found. Please create admin user first.');
    return;
  }

  console.log(`Using admin user: ${adminUser.fullName} (${adminUser.email})\n`);
  let totalNews = 0;

  for (const courtFile of courtFiles) {
    const filePath = `src/data/news/${courtFile}.json`;
    console.log(`Fetching ${courtFile}...`);
    
    const data = await getJSONFromGit(filePath);
    if (!data || !data.news || !Array.isArray(data.news)) {
      console.log(`  ⚠️  No news found in ${courtFile}`);
      continue;
    }

    console.log(`  📄 Found ${data.news.length} articles`);

    for (const newsItem of data.news) {
      try {
        // Check if already exists
        const existing = await prisma.news.findFirst({
          where: { title: newsItem.title }
        });

        if (existing) {
          console.log(`  ⏭️  Skipping "${newsItem.title}" (already exists)`);
          continue;
        }

        await prisma.news.create({
          data: {
            title: newsItem.title,
            content: newsItem.content,
            category: newsItem.category || 'Legal Update',
            publishDate: new Date(newsItem.publishDate),
            imageUrl: newsItem.imageUrl || null,
            videoUrl: newsItem.videoUrl || null,
            videoThumbnail: newsItem.videoThumbnail || null,
            hasVideo: newsItem.hasVideo || false,
            courtName: newsItem.courtName || data.courtName || null,
            tags: newsItem.tags || [],
            readTime: newsItem.readTime || null,
            authorId: adminUser.id,
          }
        });

        totalNews++;
        console.log(`  ✅ Added: ${newsItem.title.substring(0, 50)}...`);
      } catch (error) {
        console.error(`  ❌ Error adding news: ${error.message}`);
      }
    }
  }

  console.log(`\n✨ Total news articles migrated: ${totalNews}\n`);
}

async function migrateJudges() {
  console.log('\n⚖️  Migrating Judges...\n');
  
  const judgesData = await getJSONFromGit('src/data/judges.json');
  if (!judgesData) {
    console.log('  ❌ Could not fetch judges.json');
    return;
  }

  let totalJudges = 0;

  // Process all categories
  const categories = [
    { key: 'currentChiefJustice', type: 'chief-justice', status: 'current', category: 'Current Chief Justice' },
    { key: 'currentJudges', type: 'judge', status: 'current', category: 'Current Judge' },
    { key: 'formerChiefJustices', type: 'chief-justice', status: 'former', category: 'Former Chief Justice' },
    { key: 'formerJudges', type: 'judge', status: 'former', category: 'Former Judge' }
  ];

  for (const cat of categories) {
    const judges = judgesData[cat.key];
    if (!Array.isArray(judges)) continue;

    console.log(`Processing ${cat.category}: ${judges.length} judges`);

    for (const judge of judges) {
      try {
        // Check if already exists
        const existing = await prisma.judge.findFirst({
          where: { fullName: judge.fullName }
        });

        if (existing) {
          console.log(`  ⏭️  Skipping ${judge.fullName} (already exists)`);
          continue;
        }

        await prisma.judge.create({
          data: {
            name: judge.name || judge.fullName,
            fullName: judge.fullName,
            designation: judge.position || 'Judge',
            court: judge.court || 'Supreme Court of India',
            photoUrl: judge.image || judge.photoUrl || null,
            appointmentDate: judge.appointmentDate || '',
            retirementDate: judge.retirementDate || '',
            dateOfBirth: judge.dateOfBirth || '',
            education: judge.education || [],
            biography: judge.biography || '',
            specializations: judge.specializations || [],
            careerHighlights: judge.careerHighlights || [],
            notableJudgments: judge.notableJudgments || [],
            type: cat.type,
            status: cat.status,
            category: cat.category
          }
        });

        totalJudges++;
        console.log(`  ✅ Added: ${judge.fullName}`);
      } catch (error) {
        console.error(`  ❌ Error adding judge ${judge.fullName}: ${error.message}`);
      }
    }
  }

  console.log(`\n✨ Total judges migrated: ${totalJudges}\n`);
}

async function main() {
  console.log('🚀 Starting JSON to MongoDB migration...\n');
  console.log('This will import data from deleted JSON files (commit 55da3a5)\n');

  try {
    await migrateNews();
    await migrateJudges();
    
    console.log('\n✅ Migration completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
