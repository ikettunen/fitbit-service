/**
 * Fitbit Service - Demo Endpoints Tests
 * Test Suite: S6.TS5
 * 
 * Tests demo/testing endpoints for quick data setup.
 */

const request = require('supertest');
const express = require('express');

// Mock dependencies
jest.mock('../src/store/keyStore', () => ({
  set: jest.fn(),
}));

const keyStore = require('../src/store/keyStore');
const routes = require('../src/routes/fitbitRoutes');

const app = express();
app.use(express.json());
app.use('/api/fitbit', routes);

describe('S6.TS5: Demo Endpoints Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: S6.TS5.1
   * Verify that POST /api/fitbit/demo/link/:patientId links demo data
   * 
   * Expected behavior:
   * - Status code should be 200
   * - Should link patient with DEMO_KEY
   * - Response should contain success message
   */
  test('S6.TS5.1 - POST /api/fitbit/demo/link/:patientId links demo data', async () => {
    const response = await request(app)
      .post('/api/fitbit/demo/link/P0001')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(keyStore.set).toHaveBeenCalledWith('P0001', 'DEMO_KEY');
    expect(response.body).toHaveProperty('success', true);
  });

  /**
   * Test: S6.TS5.2
   * Verify that demo endpoint uses DEMO_KEY
   * 
   * Expected behavior:
   * - keyStore.set should be called with 'DEMO_KEY' as the API key
   * - This allows for consistent demo data
   */
  test('S6.TS5.2 - Demo endpoint uses DEMO_KEY', async () => {
    await request(app)
      .post('/api/fitbit/demo/link/P0002')
      .expect(200);

    expect(keyStore.set).toHaveBeenCalledWith('P0002', 'DEMO_KEY');
    
    // Verify the second argument is specifically 'DEMO_KEY'
    const callArgs = keyStore.set.mock.calls[0];
    expect(callArgs[1]).toBe('DEMO_KEY');
  });

});
