const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function migrateSpecialization() {
  const uri = process.env.DATABASE_URL;
  
  if (!uri) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const database = client.db();
    const users = database.collection('User');

    // Find all users with specialization as string
    const result = await users.updateMany(
      { 
        role: 'ADVOCATE',
        specialization: { $type: 'string' }  // Find where specialization is a string
      },
      [
        {
          $set: {
            specialization: {
              $cond: {
                if: { $eq: [{ $type: '$specialization' }, 'string'] },
                then: ['$specialization'],  // Wrap string in array
                else: '$specialization'      // Keep as is if already array
              }
            }
          }
        }
      ]
    );

    console.log(`✓ Migration completed!`);
    console.log(`  - Matched: ${result.matchedCount} documents`);
    console.log(`  - Modified: ${result.modifiedCount} documents`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.close();
    console.log('✓ Disconnected from MongoDB');
  }
}

migrateSpecialization();
