const Redis = require('ioredis');

const memory = new Map();
let redis = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 2 });
}

async function get(key) {
  if (redis) return await redis.get(key);
  return memory.get(key) || null;
}

async function set(key, value) {
  if (redis) return await redis.set(key, value);
  memory.set(key, value);
}

async function del(key) {
  if (redis) return await redis.del(key);
  memory.delete(key);
}

module.exports = { get, set, del };
