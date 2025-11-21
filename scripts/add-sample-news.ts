import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Adding sample news articles...');

  // First, get the first user to use as author
  const users = await prisma.user.findMany({ take: 1 });
  
  if (users.length === 0) {
    console.error('❌ No users found in database. Please create a user first.');
    return;
  }

  const author = users[0];

  const sampleNews = [
    {
      title: 'Supreme Court Upholds Constitutional Rights in Landmark Judgment',
      content: 'In a significant ruling, the Supreme Court has reinforced fundamental rights by declaring that privacy is an intrinsic part of the right to life and personal liberty under Article 21 of the Constitution. The nine-judge bench unanimously held that the right to privacy is protected as an intrinsic part of the right to life and personal liberty.',
      category: 'Supreme Court',
      courtName: 'Supreme Court of India',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      tags: ['Constitutional Law', 'Privacy Rights', 'Landmark Judgment']
    },
    {
      title: 'Delhi High Court Grants Bail in High-Profile Corporate Fraud Case',
      content: 'The Delhi High Court has granted bail to a senior executive accused in a major corporate fraud case, citing lack of evidence of tampering with witnesses. The court observed that prolonged incarceration without trial amounts to punishment before conviction.',
      category: 'High Court',
      courtName: 'Delhi High Court',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      tags: ['Corporate Law', 'Bail', 'Delhi High Court']
    },
    {
      title: 'Supreme Court Directs States to Protect Environment',
      content: 'The Supreme Court has issued comprehensive guidelines to all states regarding environmental protection and sustainable development. The court emphasized that development cannot be at the cost of environmental degradation.',
      category: 'Supreme Court',
      courtName: 'Supreme Court of India',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      tags: ['Environmental Law', 'Public Interest', 'Guidelines']
    },
    {
      title: 'Bombay High Court Rules on Property Dispute Resolution',
      content: 'The Bombay High Court has set important precedents in property dispute resolution, ruling that oral agreements backed by substantial evidence can be enforceable. This judgment provides clarity on property transaction disputes.',
      category: 'High Court',
      courtName: 'Bombay High Court',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      tags: ['Property Law', 'Civil Law', 'Bombay High Court']
    },
    {
      title: 'SC Strengthens Women\'s Rights in Matrimonial Cases',
      content: 'The Supreme Court has delivered a progressive judgment strengthening women\'s rights in matrimonial disputes. The court ruled that women have equal rights to marital property and cannot be evicted from their matrimonial home.',
      category: 'Supreme Court',
      courtName: 'Supreme Court of India',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      tags: ['Family Law', 'Women Rights', 'Matrimonial Dispute']
    },
    {
      title: 'Madras High Court on Digital Evidence Admissibility',
      content: 'The Madras High Court has provided detailed guidelines on the admissibility of digital evidence in criminal trials. The judgment addresses concerns about authenticity and chain of custody of electronic evidence.',
      category: 'High Court',
      courtName: 'Madras High Court',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      tags: ['Criminal Law', 'Digital Evidence', 'Madras High Court']
    },
    {
      title: 'Supreme Court Clarifies GST Collection Process',
      content: 'In a major relief to businesses, the Supreme Court has clarified the GST collection process and ruled that retrospective tax demands cannot be raised beyond the statutory limitation period.',
      category: 'Supreme Court',
      courtName: 'Supreme Court of India',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      tags: ['Tax Law', 'GST', 'Business Law']
    },
    {
      title: 'Karnataka High Court on Labour Rights Protection',
      content: 'The Karnataka High Court has reinforced labour rights by directing companies to follow due process before terminating employees. The court emphasized the importance of natural justice in employment matters.',
      category: 'High Court',
      courtName: 'Karnataka High Court',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      tags: ['Labour Law', 'Employment Rights', 'Karnataka High Court']
    },
  ];

  for (const newsData of sampleNews) {
    try {
      const news = await prisma.news.create({
        data: {
          ...newsData,
          authorId: author.id,
          publishDate: new Date(),
          views: Math.floor(Math.random() * 1000),
          likes: Math.floor(Math.random() * 100),
        },
      });
      console.log(`✅ Created: ${news.title}`);
    } catch (error) {
      console.error(`❌ Failed to create news:`, error);
    }
  }

  console.log('✨ Sample news articles added successfully!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
