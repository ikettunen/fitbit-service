# Fit-Bit Service

Microservice to fetch Fitbit data for patients and manage API key links.

## Environment Variables

```
PORT=3010
LOG_LEVEL=info
REDIS_URL=redis://redis:6379            # optional; if absent, in-memory store is used
FITBIT_OAUTH_BEARER=                     # typically per-patient; this service stores per-patient keys
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
  - returns steps, resting heart rate, sleep summary
