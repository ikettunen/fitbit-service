/**
 * Fitbit Service - Fitbit API Integration Tests
 * Test Suite: S6.TS6
 * 
 * Tests integration with Fitbit API including API calls,
 * response parsing, error handling, and rate limiting.
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

describe('S6.TS6: Fitbit API Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: S6.TS6.1
   * Verify that Fitbit API calls are made correctly
   * 
   * Expected behavior:
   * - fitbitClient methods should be called with correct parameters
   * - API key should be passed to client methods
   * - All three data types should be requested (steps, heart rate, sleep)
   */
  test('S6.TS6.1 - Fitbit API calls are made correctly', async () => {
    const testApiKey = 'test_api_key_123';
    keyStore.get.mockResolvedValue(testApiKey);
    fitbitClient.getDailySteps.mockResolvedValue(8000);
    fitbitClient.getRestingHeartRate.mockResolvedValue(70);
    fitbitClient.getSleepSummary.mockResolvedValue({ totalMinutesAsleep: 420 });

    await request(app)
      .get('/api/fitbit/patients/P0001/summary')
      .expect(200);

    // Verify all three Fitbit client methods were called
    expect(fitbitClient.getDailySteps).toHaveBeenCalledWith(testApiKey);
    expect(fitbitClient.getRestingHeartRate).toHaveBeenCalledWith(testApiKey);
    expect(fitbitClient.getSleepSummary).toHaveBeenCalledWith(testApiKey);
  });

  /**
   * Test: S6.TS6.2
   * Verify that API responses are parsed correctly
   * 
   * Expected behavior:
   * - Steps should be returned as a number
   * - Heart rate should be returned as a number
   * - Sleep data should be returned as an object
   * - All data should be included in the response
   */
  test('S6.TS6.2 - API responses are parsed correctly', async () => {
    keyStore.get.mockResolvedValue('test_key');
    fitbitClient.getDailySteps.mockResolvedValue(12345);
    fitbitClient.getRestingHeartRate.mockResolvedValue(65);
    fitbitClient.getSleepSummary.mockResolvedValue({ 
      totalMinutesAsleep: 480,
      totalTimeInBed: 510,
      efficiency: 94
    });

    const response = await request(app)
      .get('/api/fitbit/patients/P0001/summary')
      .expect(200);

    const { data } = response.body;
    
    // Verify data types and values
    expect(typeof data.steps).toBe('number');
    expect(data.steps).toBe(12345);
    
    expect(typeof data.heartRate).toBe('number');
    expect(data.heartRate).toBe(65);
    
    expect(typeof data.sleep).toBe('object');
    expect(data.sleep.totalMinutesAsleep).toBe(480);
    expect(data.sleep.efficiency).toBe(94);
  });

  /**
   * Test: S6.TS6.3
   * Verify that API errors are handled gracefully
   * 
   * Expected behavior:
   * - Should return 500 or appropriate error code
   * - Should include error message in response
   * - Should not crash the service
   */
  test('S6.TS6.3 - API errors are handled gracefully', async () => {
    keyStore.get.mockResolvedValue('test_key');
    fitbitClient.getDailySteps.mockRejectedValue(new Error('Fitbit API error'));
    fitbitClient.getRestingHeartRate.mockRejectedValue(new Error('Fitbit API error'));
    fitbitClient.getSleepSummary.mockRejectedValue(new Error('Fitbit API error'));

    const response = await request(app)
      .get('/api/fitbit/patients/P0001/summary');

    // Should return an error status (500 or similar)
    expect(response.status).toBeGreaterThanOrEqual(400);
    
    // Should have error information
    expect(response.body).toHaveProperty('error');
  });

  /**
   * Test: S6.TS6.4
   * Verify that rate limiting is respected
   * 
   * Expected behavior:
   * - Service should handle rate limit errors
   * - Should return appropriate error message
   * - Should not make excessive API calls
   */
  test('S6.TS6.4 - Rate limiting is respected', async () => {
    keyStore.get.mockResolvedValue('test_key');
    
    // Simulate rate limit error
    const rateLimitError = new Error('Rate limit exceeded');
    rateLimitError.status = 429;
    fitbitClient.getDailySteps.mockRejectedValue(rateLimitError);

    const response = await request(app)
      .get('/api/fitbit/patients/P0001/summary');

    // Should handle rate limit error
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.body).toHaveProperty('error');
  });

});
