import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing team members...');
  
  try {
    // Delete all existing team members first
    await prisma.teamMember.deleteMany({});
    console.log('✓ Cleared existing team members');

    // Create President
    const president = await prisma.teamMember.create({
      data: {
        barRegistrationNo: 'BAR/DEL/2001/12345',
        title: 'Adv.',
        name: 'Rajesh Kumar',
        emailId: 'president@indianadvocateforum.org',
        legalTitle: 'Senior Advocate',
        phoneNo: '+91-98765-43210',
        yearOfBirth: '1975',
        placeOfPractice: 'Supreme Court of India, New Delhi',
        address: '12, Lawyers Chambers, Supreme Court of India, New Delhi - 110001',
        enrollment: '2001',
        webinarPrimaryPreference: 'Constitutional Law',
        webinarSecondaryPreference: 'Criminal Law',
        articleContribution: true,
        references: 'President',
        profilePhoto: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        role: 'President'
      }
    });
    console.log('✓ Created President:', president.name);

    // Create Director General
    const dg = await prisma.teamMember.create({
      data: {
        barRegistrationNo: 'BAR/BOM/2005/67890',
        title: 'Adv.',
        name: 'Priya Sharma',
        emailId: 'dg@indianadvocateforum.org',
        legalTitle: 'Advocate',
        phoneNo: '+91-98765-11111',
        yearOfBirth: '1980',
        placeOfPractice: 'Bombay High Court, Mumbai',
        address: '5th Floor, Court Building, Bombay High Court, Mumbai - 400032',
        enrollment: '2005',
        webinarPrimaryPreference: 'Corporate Law',
        webinarSecondaryPreference: 'Intellectual Property',
        articleContribution: true,
        references: 'DG',
        profilePhoto: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        role: 'Director General'
      }
    });
    console.log('✓ Created Director General:', dg.name);

    console.log('\n✅ Successfully created 2 team members!');
    console.log('You can now view them at: http://localhost:3000/our-team');

  } catch (error) {
    console.error('Error creating team members:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
