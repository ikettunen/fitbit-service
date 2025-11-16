/**
 * Fitbit Service - API Key Management Tests
 * Test Suite: S6.TS2
 * 
 * Tests API key linking and unlinking functionality for patients.
 */

const request = require('supertest');
const express = require('express');

// Mock dependencies
jest.mock('../src/store/keyStore', () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
}));

const keyStore = require('../src/store/keyStore');
const routes = require('../src/routes/fitbitRoutes');

const app = express();
app.use(express.json());
app.use('/api/fitbit', routes);

describe('S6.TS2: API Key Management Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: S6.TS2.1
   * Verify that POST /api/fitbit/link links API key to patient
   * 
   * Expected behavior:
   * - Status code should be 200
   * - keyStore.set should be called with patientId and apiKey
   * - Response should contain success message
   */
  test('S6.TS2.1 - POST /api/fitbit/link links API key to patient', async () => {
    const response = await request(app)
      .post('/api/fitbit/link')
      .send({ patientId: 'P0001', apiKey: 'test_api_key_123' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(keyStore.set).toHaveBeenCalledWith('P0001', 'test_api_key_123');
    expect(response.body).toHaveProperty('success', true);
  });

  /**
   * Test: S6.TS2.2
   * Verify that link endpoint validates required fields
   * 
   * Expected behavior:
   * - Status code should be 400 when patientId is missing
   * - Status code should be 400 when apiKey is missing
   * - Response should contain error message
   */
  test('S6.TS2.2 - POST /api/fitbit/link validates required fields', async () => {
    // Missing both fields
    let response = await request(app)
      .post('/api/fitbit/link')
      .send({})
      .expect(400);
    
    expect(response.body).toHaveProperty('error');

    // Missing apiKey
    response = await request(app)
      .post('/api/fitbit/link')
      .send({ patientId: 'P0001' })
      .expect(400);
    
    expect(response.body).toHaveProperty('error');

    // Missing patientId
    response = await request(app)
      .post('/api/fitbit/link')
      .send({ apiKey: 'test_key' })
      .expect(400);
    
    expect(response.body).toHaveProperty('error');
  });

  /**
   * Test: S6.TS2.3
   * Verify that link endpoint returns success message
   * 
   * Expected behavior:
   * - Response should contain success: true
   * - Response should contain a message
   */
  test('S6.TS2.3 - POST /api/fitbit/link returns success message', async () => {
    const response = await request(app)
      .post('/api/fitbit/link')
      .send({ patientId: 'P0001', apiKey: 'test_key' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('message');
  });

  /**
   * Test: S6.TS2.4
   * Verify that POST /api/fitbit/unlink removes API key association
   * 
   * Expected behavior:
   * - Status code should be 200
   * - keyStore.del should be called with patientId
   * - Response should contain success message
   */
  test('S6.TS2.4 - POST /api/fitbit/unlink removes API key association', async () => {
    const response = await request(app)
      .post('/api/fitbit/unlink')
      .send({ patientId: 'P0001' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(keyStore.del).toHaveBeenCalledWith('P0001');
    expect(response.body).toHaveProperty('success', true);
  });

  /**
   * Test: S6.TS2.5
   * Verify that unlink endpoint validates patientId
   * 
   * Expected behavior:
   * - Status code should be 400 when patientId is missing
   * - Response should contain error message
   */
  test('S6.TS2.5 - POST /api/fitbit/unlink validates patientId', async () => {
    const response = await request(app)
      .post('/api/fitbit/unlink')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

});
