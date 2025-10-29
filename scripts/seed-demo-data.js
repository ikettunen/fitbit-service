const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

async function seedDemoData() {
  console.log('Seeding demo Fitbit data...');
  
  const demoPatients = ['1001', '1002', '1003', '1004', '1005', '123'];
  
  for (const patientId of demoPatients) {
    await redis.set(patientId, 'DEMO_KEY');
    console.log(`✓ Linked DEMO_KEY for patient ${patientId}`);
  }
  
  console.log('Demo data seeded successfully!');
  process.exit(0);
}

seedDemoData().catch(console.error);