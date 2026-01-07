import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

import prisma from '../src/lib/prisma';

async function cleanupDuplicateUsers() {
  try {
    console.log('Starting cleanup of duplicate users...\n');

    // Find all users
    const allUsers = await prisma.user.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group users by email
    const usersByEmail = new Map<string, any[]>();
    
    for (const user of allUsers) {
      const email = user.email.toLowerCase();
      if (!usersByEmail.has(email)) {
        usersByEmail.set(email, []);
      }
      usersByEmail.get(email)!.push(user);
    }

    // Find duplicates
    const duplicates = Array.from(usersByEmail.entries())
      .filter(([email, users]) => users.length > 1);

    if (duplicates.length === 0) {
      console.log('No duplicate users found!');
      return;
    }

    console.log(`Found ${duplicates.length} email(s) with duplicate accounts:\n`);

    for (const [email, users] of duplicates) {
      console.log(`\nEmail: ${email}`);
      console.log(`Number of accounts: ${users.length}`);
      
      // Sort by most complete profile (has more data) and oldest
      const sortedUsers = users.sort((a, b) => {
        // Prioritize accounts with completed profiles
        if (a.isProfileSetup !== b.isProfileSetup) {
          return a.isProfileSetup ? -1 : 1;
        }
        
        // Prioritize older accounts
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

      const keepUser = sortedUsers[0];
      const deleteUsers = sortedUsers.slice(1);

      console.log(`\n  Keeping account:`);
      console.log(`    ID: ${keepUser.id}`);
      console.log(`    Auth0ID: ${keepUser.auth0Id}`);
      console.log(`    Name: ${keepUser.fullName}`);
      console.log(`    Role: ${keepUser.role}`);
      console.log(`    Profile Setup: ${keepUser.isProfileSetup}`);
      console.log(`    Created: ${keepUser.createdAt}`);

      console.log(`\n  Deleting ${deleteUsers.length} duplicate account(s):`);
      
      for (const deleteUser of deleteUsers) {
        console.log(`    - ID: ${deleteUser.id}, Auth0ID: ${deleteUser.auth0Id}, Created: ${deleteUser.createdAt}`);
        
        // Before deleting, merge related data
        // Update news articles
        await prisma.news.updateMany({
          where: { authorId: deleteUser.id },
          data: { authorId: keepUser.id }
        });

        // Update payments
        await prisma.payment.updateMany({
          where: { userId: deleteUser.id },
          data: { userId: keepUser.id }
        });

        // Update meetings
        await prisma.meeting.updateMany({
          where: { hostId: deleteUser.id },
          data: { hostId: keepUser.id }
        });

        // Update podcasts
        await prisma.podcast.updateMany({
          where: { uploadedById: deleteUser.id },
          data: { uploadedById: keepUser.id }
        });

        // Delete the duplicate user
        await prisma.user.delete({
          where: { id: deleteUser.id }
        });
      }

      console.log(`  ✓ Cleaned up duplicates for ${email}`);
    }

    console.log('\n✓ Cleanup completed successfully!');

  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupDuplicateUsers()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
