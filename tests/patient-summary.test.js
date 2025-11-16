/**
 * Fitbit Service - Patient Summary Tests
 * Test Suite: S6.TS3
 * 
 * Tests patient health data summary retrieval including
 * steps, heart rate, and sleep data.
 */

const request = require('supertest');
const express = require('express');

// Mock dependencies
jest.mock('../src/store/keyStore', () => ({
  get: jest.fn(),
}));

jest.mock('../src/integrations/fitbitClient', () => ({
  getDailySteps: jest.fn(),
  getRestingHeartRate: jest.fn(),
  getSleepSummary: jest.fn(),
}));

const keyStore = require('../src/store/keyStore');
const fitbitClient = require('../src/integrations/fitbitClient');
const routes = require('../src/routes/fitbitRoutes');

const app = express();
app.use(express.json());
app.use('/api/fitbit', routes);

describe('S6.TS3: Patient Summary Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: S6.TS3.1
   * Verify that GET /api/fitbit/patients/:patientId/summary returns health data
   * 
   * Expected behavior:
   * - Status code should be 200
   * - Response should contain steps, heart rate, and sleep data
   * - All data should be properly formatted
   */
  test('S6.TS3.1 - GET /api/fitbit/patients/:patientId/summary returns health data', async () => {
    keyStore.get.mockResolvedValue('test_api_key');
    fitbitClient.getDailySteps.mockResolvedValue(8500);
    fitbitClient.getRestingHeartRate.mockResolvedValue(72);
    fitbitClient.getSleepSummary.mockResolvedValue({ 
      totalMinutesAsleep: 450,
      totalTimeInBed: 480
    });

    const response = await request(app)
      .get('/api/fitbit/patients/P0001/summary')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('steps', 8500);
    expect(response.body.data).toHaveProperty('heartRate', 72);
    expect(response.body.data).toHaveProperty('sleep');
  });

  /**
   * Test: S6.TS3.2
   * Verify that summary includes steps, heart rate, and sleep data
   * 
   * Expected behavior:
   * - Response data should have all three metrics
   * - Steps should be a number
   * - Heart rate should be a number
   * - Sleep should be an object with details
   */
  test('S6.TS3.2 - Summary includes steps, heart rate, and sleep data', async () => {
    keyStore.get.mockResolvedValue('test_api_key');
    fitbitClient.getDailySteps.mockResolvedValue(10000);
    fitbitClient.getRestingHeartRate.mockResolvedValue(68);
    fitbitClient.getSleepSummary.mockResolvedValue({ 
      totalMinutesAsleep: 420,
      totalTimeInBed: 450
    });

    const response = await request(app)
      .get('/api/fitbit/patients/P0002/summary')
      .expect(200);

    const { data } = response.body;
    
    // Verify steps
    expect(typeof data.steps).toBe('number');
    expect(data.steps).toBeGreaterThanOrEqual(0);
    
    // Verify heart rate
    expect(typeof data.heartRate).toBe('number');
    expect(data.heartRate).toBeGreaterThan(0);
    
    // Verify sleep data
    expect(typeof data.sleep).toBe('object');
    expect(data.sleep).toHaveProperty('totalMinutesAsleep');
  });

  /**
   * Test: S6.TS3.3
   * Verify that GET with unlinked patient returns 404
   * 
   * Expected behavior:
   * - Status code should be 404
   * - Response should contain error message
   * - Should indicate patient is not linked
   */
  test('S6.TS3.3 - GET with unlinked patient returns 404', async () => {
    keyStore.get.mockResolvedValue(null);

    const response = await request(app)
      .get('/api/fitbit/patients/P9999/summary')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/not linked|not found/i);
  });

  /**
   * Test: S6.TS3.4
   * Verify that GET with invalid patientId returns 404
   * 
   * Expected behavior:
   * - Status code should be 404
   * - Response should contain error message
   */
  test('S6.TS3.4 - GET with invalid patientId returns 404', async () => {
    keyStore.get.mockResolvedValue(null);

    const response = await request(app)
      .get('/api/fitbit/patients/INVALID/summary')
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

});
