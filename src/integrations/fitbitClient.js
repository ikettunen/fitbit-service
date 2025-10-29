const axios = require('axios');

const BASE_URL = 'https://api.fitbit.com/1/user/-';

function authHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}

// Generate demo data based on patient ID for consistency
function generateDemoData(patientId = 'default') {
  // Use patient ID as seed for consistent data per patient
  const seed = patientId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const random = (min, max) => Math.floor((seed * 9301 + 49297) % 233280 / 233280 * (max - min)) + min;
  
  return {
    steps: random(2500, 8500), // Steps between 2500-8500
    heartRate: random(58, 85), // Heart rate between 58-85 BPM
    sleep: {
      totalMinutesAsleep: random(300, 540), // 5-9 hours sleep
      totalTimeInBed: random(360, 600), // 6-10 hours in bed
      efficiency: random(75, 95) // 75-95% efficiency
    }
  };
}

// Check if using demo/test API key
function isDemoKey(apiKey) {
  return apiKey === 'DEMO_KEY' || apiKey === 'TEST_KEY' || apiKey.startsWith('demo_') || apiKey.startsWith('test_');
}

async function getDailySteps(apiKey, patientId = 'default') {
  // Return demo data for test keys
  if (isDemoKey(apiKey)) {
    const demoData = generateDemoData(patientId);
    return demoData.steps;
  }

  // Real Fitbit API call
  const url = `${BASE_URL}/activities/steps/date/today/1d.json`;
  const { data } = await axios.get(url, { headers: authHeaders(apiKey) });
  const arr = data?.['activities-steps'] || [];
  return arr.length ? parseInt(arr[0].value, 10) : 0;
}

async function getRestingHeartRate(apiKey, patientId = 'default') {
  // Return demo data for test keys
  if (isDemoKey(apiKey)) {
    const demoData = generateDemoData(patientId);
    return demoData.heartRate;
  }

  // Real Fitbit API call
  const url = `${BASE_URL}/activities/heart/date/today/1d.json`;
  const { data } = await axios.get(url, { headers: authHeaders(apiKey) });
  const hr = data?.['activities-heart']?.[0]?.value?.restingHeartRate;
  return hr ?? null;
}

async function getSleepSummary(apiKey, patientId = 'default') {
  // Return demo data for test keys
  if (isDemoKey(apiKey)) {
    const demoData = generateDemoData(patientId);
    return demoData.sleep;
  }

  // Real Fitbit API call
  const url = `${BASE_URL}/sleep/date/today.json`;
  const { data } = await axios.get(url, { headers: authHeaders(apiKey) });
  const summary = data?.summary || {};
  return {
    totalMinutesAsleep: summary.totalMinutesAsleep ?? 0,
    totalTimeInBed: summary.totalTimeInBed ?? 0,
    efficiency: summary.efficiency ?? null,
  };
}

module.exports = { getDailySteps, getRestingHeartRate, getSleepSummary };
