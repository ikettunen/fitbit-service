const express = require('express');
const controller = require('../controllers/fitbitController');

const router = express.Router();

// Link an API key to a patient
router.post('/link', controller.linkKey);

// Unlink an API key
router.post('/unlink', controller.unlinkKey);

// Get summary for a patient (steps, heart rate, sleep)
router.get('/patients/:patientId/summary', controller.getPatientSummary);

module.exports = router;
