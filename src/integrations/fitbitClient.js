const axios = require('axios');

const BASE_URL = 'https://api.fitbit.com/1/user/-';

function authHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}

async function getDailySteps(apiKey) {
  // Example endpoint; in real use, supply date or range
  const url = `${BASE_URL}/activities/steps/date/today/1d.json`;
  const { data } = await axios.get(url, { headers: authHeaders(apiKey) });
  const arr = data?.['activities-steps'] || [];
  return arr.length ? parseInt(arr[0].value, 10) : 0;
}

async function getRestingHeartRate(apiKey) {
  const url = `${BASE_URL}/activities/heart/date/today/1d.json`;
  const { data } = await axios.get(url, { headers: authHeaders(apiKey) });
  const hr = data?.['activities-heart']?.[0]?.value?.restingHeartRate;
  return hr ?? null;
}

async function getSleepSummary(apiKey) {
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
