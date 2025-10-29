const express = require('express');
const controller = require('../controllers/fitbitController');

const router = express.Router();

// Link an API key to a patient
router.post('/link', controller.linkKey);

// Unlink an API key
router.post('/unlink', controller.unlinkKey);

// Get summary for a patient (steps, heart rate, sleep)
router.get('/patients/:patientId/summary', controller.getPatientSummary);

// Get summary for multiple patients (batch request)
router.post('/patients/batch/summary', controller.getBatchPatientSummary);

// Test endpoint to quickly link demo data
router.post('/demo/link/:patientId', (req, res) => {
  const { patientId } = req.params;
  req.body = { patientId, apiKey: 'DEMO_KEY' };
  controller.linkKey(req, res, (err) => {
    if (err) throw err;
  });
});

module.exports = router;
