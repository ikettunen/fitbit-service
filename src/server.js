const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const pino = require('pino');
const expressPino = require('express-pino-logger');
require('dotenv').config();

const fitbitRoutes = require('./routes/fitbitRoutes');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(expressLogger);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'fit-bit-service' });
});

app.use('/api/fitbit', fitbitRoutes);

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({ error: { message: err.message || 'Internal Server Error' } });
});

const port = process.env.PORT || 3010;
app.listen(port, () => {
  logger.info(`Fitbit service listening at http://localhost:${port}`);
});

module.exports = app;
