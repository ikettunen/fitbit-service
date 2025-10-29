const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

async function addRealPatient() {
  console.log('Adding demo key for real patient...');

  // Add the actual patient IDs from the API
  const patientIds = [
    'a1f1cfdd-93c5-405b-82ea-58ba86fd4f25',
    '424a09b9-06e8-4b6b-8cd2-8863a37b513b'
  ];

  for (const patientId of patientIds) {
    await redis.set(patientId, 'DEMO_KEY');
    console.log(`✓ Linked DEMO_KEY for patient ${patientId}`);
  }

  // List all keys to verify
  const keys = await redis.keys('*');
  console.log('All patient keys in Redis:', keys);

  redis.disconnect();
  console.log('Done!');
}

addRealPatient().catch(console.error);