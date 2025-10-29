const request = require('supertest');
const express = require('express');

jest.mock('../src/store/keyStore', () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
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

describe('Fitbit Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  it('links a key', async () => {
    const res = await request(app)
      .post('/api/fitbit/link')
      .send({ patientId: 'P1', apiKey: 'K' });

    expect(res.status).toBe(200);
    expect(keyStore.set).toHaveBeenCalledWith('P1', 'K');
  });

  it('rejects link without params', async () => {
    const res = await request(app)
      .post('/api/fitbit/link')
      .send({});

    expect(res.status).toBe(400);
  });

  it('unlinks a key', async () => {
    const res = await request(app)
      .post('/api/fitbit/unlink')
      .send({ patientId: 'P1' });

    expect(res.status).toBe(200);
    expect(keyStore.del).toHaveBeenCalledWith('P1');
  });

  it('returns 404 when summary requested without linked key', async () => {
    keyStore.get.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/fitbit/patients/P1/summary');

    expect(res.status).toBe(404);
  });

  it('returns summary when key linked', async () => {
    keyStore.get.mockResolvedValue('K');
    fitbitClient.getDailySteps.mockResolvedValue(1234);
    fitbitClient.getRestingHeartRate.mockResolvedValue(60);
    fitbitClient.getSleepSummary.mockResolvedValue({ totalMinutesAsleep: 400 });

    const res = await request(app)
      .get('/api/fitbit/patients/P1/summary');

    expect(res.status).toBe(200);
    expect(res.body.data.steps).toBe(1234);
    expect(res.body.data.heartRate).toBe(60);
    expect(res.body.data.sleep.totalMinutesAsleep).toBe(400);
  });
});
