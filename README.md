# Fit-Bit Service

Microservice to fetch Fitbit data for patients and manage API key links.

## Environment Variables

```
PORT=3010
LOG_LEVEL=info
REDIS_URL=redis://localhost:6379        # Required for persistent storage
```

## Install & Test

```
npm install
npm test
```

## Run

```
npm start
# or
npm run dev
```

## Docker

```
docker build -t fit-bit-service:latest .
docker run -p 3010:3010 --env-file .env fit-bit-service:latest
```

## API

- POST /api/fitbit/link
  - body: { patientId, apiKey }
- POST /api/fitbit/unlink
  - body: { patientId }
- GET /api/fitbit/patients/:patientId/summary
  - returns steps, resting heart rate, sleep summary for single patient
- POST /api/fitbit/patients/batch/summary
  - body: { patientIds: ["patient1", "patient2", ...] }
  - returns array of patient summaries with error handling

## Storage

API keys are stored in Redis for both development and production. 
Make sure Redis is running locally on port 6379 or set `REDIS_URL` to your Redis instance.

### Setup Demo Data

After starting Redis, run the demo data seeder:

```bash
npm run seed-demo
```

This will link DEMO_KEY to patients 1001-1005 for testing.

## Demo/Test Mode

For testing without real Fitbit credentials, use any of these demo API keys:
- `DEMO_KEY`
- `TEST_KEY` 
- Any key starting with `demo_` (e.g., `demo_patient123`)
- Any key starting with `test_` (e.g., `test_user456`)

Demo keys return realistic mock data:
- Steps: Random between 3,000-8,000 daily steps
- Heart Rate: Random between 60-80 BPM
- Sleep: 6-8 hours sleep with 80-95% efficiency

## Example Usage

```bash
# Quick demo setup (links DEMO_KEY automatically)
curl -X POST http://localhost:3010/api/fitbit/demo/link/123

# Or manually link demo account
curl -X POST http://localhost:3010/api/fitbit/link \
  -H "Content-Type: application/json" \
  -d '{"patientId": "123", "apiKey": "DEMO_KEY"}'

# Get demo data
curl http://localhost:3010/api/fitbit/patients/123/summary

# Batch request for multiple patients
curl -X POST http://localhost:3010/api/fitbit/patients/batch/summary \
  -H "Content-Type: application/json" \
  -d '{"patientIds": ["123", "456", "789"]}'
```
