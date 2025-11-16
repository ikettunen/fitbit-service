/**
 * Fitbit Service - Batch Operations Tests
 * Test Suite: S6.TS4
 * 
 * Tests batch retrieval of patient health data for multiple patients.
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

describe('S6.TS4: Batch Operations Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: S6.TS4.1
   * Verify that POST /api/fitbit/patients/batch/summary returns multiple patient data
   * 
   * Expected behavior:
   * - Status code should be 200
   * - Response should contain array of patient data
   * - Each patient should have their health metrics
   */
  test('S6.TS4.1 - POST /api/fitbit/patients/batch/summary returns multiple patient data', async () => {
    // Mock keyStore to return keys for some patients
    keyStore.get.mockImplementation((patientId) => {
      if (patientId === 'P0001' || patientId === 'P0002') {
        return Promise.resolve('test_api_key');
      }
      return Promise.resolve(null);
    });

    // Mock Fitbit client responses
    fitbitClient.getDailySteps.mockResolvedValue(8000);
    fitbitClient.getRestingHeartRate.mockResolvedValue(70);
    fitbitClient.getSleepSummary.mockResolvedValue({ 
      totalMinutesAsleep: 420 
    });

    const response = await request(app)
      .post('/api/fitbit/patients/batch/summary')
      .send({ patientIds: ['P0001', 'P0002', 'P0003'] })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  /**
   * Test: S6.TS4.2
   * Verify that batch request validates patientIds array
   * 
   * Expected behavior:
   * - Status code should be 400 when patientIds is missing
   * - Status code should be 400 when patientIds is not an array
   * - Response should contain error message
   */
  test('S6.TS4.2 - Batch request validates patientIds array', async () => {
    // Missing patientIds
    let response = await request(app)
      .post('/api/fitbit/patients/batch/summary')
      .send({})
      .expect(400);
    
    expect(response.body).toHaveProperty('error');

    // patientIds is not an array
    response = await request(app)
      .post('/api/fitbit/patients/batch/summary')
      .send({ patientIds: 'P0001' })
      .expect(400);
    
    expect(response.body).toHaveProperty('error');
  });

  /**
   * Test: S6.TS4.3
   * Verify that batch request handles partial failures
   * 
   * Expected behavior:
   * - Should return data for successful patients
   * - Should handle patients without linked keys gracefully
   * - Should not fail entire request if one patient fails
   */
  test('S6.TS4.3 - Batch request handles partial failures', async () => {
    // Mock keyStore to return key only for P0001
    keyStore.get.mockImplementation((patientId) => {
      if (patientId === 'P0001') {
        return Promise.resolve('test_api_key');
      }
      return Promise.resolve(null);
    });

    fitbitClient.getDailySteps.mockResolvedValue(8000);
    fitbitClient.getRestingHeartRate.mockResolvedValue(70);
    fitbitClient.getSleepSummary.mockResolvedValue({ 
      totalMinutesAsleep: 420 
    });

    const response = await request(app)
      .post('/api/fitbit/patients/batch/summary')
      .send({ patientIds: ['P0001', 'P0002', 'P0003'] })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    
    // Should have at least one successful result
    const successfulResults = response.body.data.filter(item => item.steps !== undefined);
    expect(successfulResults.length).toBeGreaterThan(0);
  });

});
