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

async function migratePodcasts() {
  console.log('\n🎙️  Migrating Sample Podcasts...\n');
  
  // Get admin user for uploadedById
  const adminUser = await prisma.user.findFirst({
    where: { email: 'sanyamgupta998@gmail.com' }
  });

  if (!adminUser) {
    console.error('❌ Admin user not found.');
    return;
  }

  const samplePodcasts = [
    {
      title: "Understanding Constitutional Rights in India",
      description: "A comprehensive discussion on fundamental rights guaranteed by the Indian Constitution, their scope, limitations, and recent judicial interpretations. This podcast covers landmark cases and their impact on citizens' rights.",
      videoUrl: "https://res.cloudinary.com/dkg5mfue6/video/upload/v1/podcasts/constitutional-rights.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dkg5mfue6/image/upload/v1/podcasts/thumbnails/constitutional-rights.jpg",
      category: "Constitutional Law",
      tags: ["Fundamental Rights", "Constitution", "Legal Education", "Supreme Court"],
      publishDate: new Date('2024-11-10T10:00:00Z')
    },
    {
      title: "Supreme Court Judgments Analysis - October 2024",
      description: "Expert analysis of significant Supreme Court judgments delivered in October 2024, covering cases on environmental law, digital privacy, and criminal justice reforms. Includes detailed explanation of legal reasoning and implications.",
      videoUrl: "https://res.cloudinary.com/dkg5mfue6/video/upload/v1/podcasts/sc-october-2024.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dkg5mfue6/image/upload/v1/podcasts/thumbnails/sc-october-2024.jpg",
      category: "Supreme Court Updates",
      tags: ["Supreme Court", "Case Analysis", "Legal Updates", "Judgments"],
      publishDate: new Date('2024-11-08T14:30:00Z')
    },
    {
      title: "Criminal Law Amendments 2024: What Changed?",
      description: "Detailed discussion on recent amendments to criminal law provisions, their impact on law enforcement and citizens' rights. This podcast breaks down complex legal changes into understandable segments with practical examples.",
      videoUrl: "https://res.cloudinary.com/dkg5mfue6/video/upload/v1/podcasts/criminal-law-amendments.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dkg5mfue6/image/upload/v1/podcasts/thumbnails/criminal-law.jpg",
      category: "Criminal Law",
      tags: ["Criminal Law", "Legal Amendments", "Law Enforcement", "Legal Tips"],
      publishDate: new Date('2024-11-05T09:00:00Z')
    },
    {
      title: "High Court Weekly Digest: Important Rulings",
      description: "Weekly roundup of significant rulings from various High Courts across India. This episode covers property disputes, commercial litigation, and administrative law matters with practical insights for advocates.",
      videoUrl: "https://res.cloudinary.com/dkg5mfue6/video/upload/v1/podcasts/hc-weekly-digest.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dkg5mfue6/image/upload/v1/podcasts/thumbnails/hc-digest.jpg",
      category: "High Court News",
      tags: ["High Courts", "Weekly Updates", "Case Law", "Legal Practice"],
      publishDate: new Date('2024-11-12T16:00:00Z')
    },
    {
      title: "Corporate Litigation: Mergers & Acquisitions Legal Framework",
      description: "In-depth analysis of legal framework governing mergers and acquisitions in India. Discussion covers SEBI regulations, competition law considerations, and recent NCLT decisions affecting corporate restructuring.",
      videoUrl: "https://res.cloudinary.com/dkg5mfue6/video/upload/v1/podcasts/corporate-ma.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dkg5mfue6/image/upload/v1/podcasts/thumbnails/corporate-ma.jpg",
      category: "Corporate Law",
      tags: ["Corporate Law", "M&A", "SEBI", "Competition Law"],
      publishDate: new Date('2024-11-01T11:00:00Z')
    },
    {
      title: "Civil Procedure Code: Recent Amendments & Practice Tips",
      description: "Practical guide to recent amendments in Civil Procedure Code with focus on case management, electronic filing, and virtual hearings. Includes tips for efficient court practice and managing litigation timelines.",
      videoUrl: "https://res.cloudinary.com/dkg5mfue6/video/upload/v1/podcasts/cpc-amendments.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dkg5mfue6/image/upload/v1/podcasts/thumbnails/cpc.jpg",
      category: "Civil Law",
      tags: ["Civil Law", "CPC", "Court Practice", "Legal Tips"],
      publishDate: new Date('2024-10-28T13:00:00Z')
    },
    {
      title: "Environmental Law: Green Tribunal Decisions Analysis",
      description: "Analysis of recent National Green Tribunal decisions on environmental compliance, pollution control, and sustainable development. Discussion includes practical implications for industries and environmental activists.",
      videoUrl: "https://res.cloudinary.com/dkg5mfue6/video/upload/v1/podcasts/ngt-analysis.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dkg5mfue6/image/upload/v1/podcasts/thumbnails/ngt.jpg",
      category: "Legal Discussion",
      tags: ["Environmental Law", "NGT", "Sustainable Development", "Green Compliance"],
      publishDate: new Date('2024-10-25T10:30:00Z')
    },
    {
      title: "Legal Career Guidance for Young Advocates",
      description: "Expert advice on building a successful legal career, including specialization choices, networking strategies, and practice management. Features insights from senior advocates on navigating the legal profession.",
      videoUrl: "https://res.cloudinary.com/dkg5mfue6/video/upload/v1/podcasts/career-guidance.mp4",
      thumbnailUrl: "https://res.cloudinary.com/dkg5mfue6/image/upload/v1/podcasts/thumbnails/career.jpg",
      category: "Legal Education",
      tags: ["Legal Career", "Career Guidance", "Practice Management", "Legal Education"],
      publishDate: new Date('2024-10-20T15:00:00Z')
    }
  ];

  let totalPodcasts = 0;

  for (const podcast of samplePodcasts) {
    try {
      // Check if already exists
      const existing = await prisma.podcast.findFirst({
        where: { title: podcast.title }
      });

      if (existing) {
        console.log(`  ⏭️  Skipping "${podcast.title}" (already exists)`);
        continue;
      }

      await prisma.podcast.create({
        data: {
          ...podcast,
          uploadedById: adminUser.id,
          isPublished: true,
          playCount: Math.floor(Math.random() * 500) + 50 // Random play count between 50-550
        }
      });

      totalPodcasts++;
      console.log(`  ✅ Added: ${podcast.title}`);
    } catch (error) {
      console.error(`  ❌ Error adding podcast: ${error.message}`);
    }
  }

  console.log(`\n✨ Total podcasts migrated: ${totalPodcasts}\n`);
}

async function main() {
  console.log('🚀 Starting JSON to MongoDB migration...\n');
  console.log('This will import data from deleted JSON files (commit 55da3a5)\n');

  try {
    await migrateNews();
    await migrateJudges();
    await migratePodcasts();
    
    console.log('\n✅ Migration completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
