/**
 * Fitbit Service - Health Endpoint Tests
 * Test Suite: S6.TS1
 * 
 * Tests the health check endpoint to ensure the service is running
 * and responding correctly.
 */

const request = require('supertest');
const app = require('../src/server');

describe('S6.TS1: Health Endpoint Tests', () => {
  
  /**
   * Test: S6.TS1.1
   * Verify that the health endpoint returns 200 status with correct service name
   * 
   * Expected behavior:
   * - Status code should be 200
   * - Response should contain status: 'ok'
   * - Response should contain service: 'fit-bit-service'
   */
  test('S6.TS1.1 - GET /health returns 200 with service name', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('service', 'fit-bit-service');
  });

});
