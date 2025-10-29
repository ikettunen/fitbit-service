const keyStore = require('../store/keyStore');
const fitbitClient = require('../integrations/fitbitClient');

async function linkKey(req, res, next) {
  try {
    const { patientId, apiKey } = req.body;
    if (!patientId || !apiKey) return res.status(400).json({ error: { message: 'patientId and apiKey required' } });
    await keyStore.set(patientId, apiKey);
    return res.status(200).json({ message: 'Linked' });
  } catch (err) { next(err); }
}

async function unlinkKey(req, res, next) {
  try {
    const { patientId } = req.body;
    if (!patientId) return res.status(400).json({ error: { message: 'patientId required' } });
    await keyStore.del(patientId);
    return res.status(200).json({ message: 'Unlinked' });
  } catch (err) { next(err); }
}

async function getPatientSummary(req, res, next) {
  try {
    const { patientId } = req.params;
    const apiKey = await keyStore.get(patientId);
    if (!apiKey) return res.status(404).json({ error: { message: 'No Fitbit key linked for patient' } });

    const [steps, heartRate, sleep] = await Promise.all([
      fitbitClient.getDailySteps(apiKey, patientId),
      fitbitClient.getRestingHeartRate(apiKey, patientId),
      fitbitClient.getSleepSummary(apiKey, patientId),
    ]);

    return res.status(200).json({ data: { patientId, steps, heartRate, sleep } });
  } catch (err) { next(err); }
}

async function getBatchPatientSummary(req, res, next) {
  try {
    const { patientIds } = req.body;
    if (!patientIds || !Array.isArray(patientIds)) {
      return res.status(400).json({ error: { message: 'patientIds array required' } });
    }

    const results = [];
    const errors = [];

    // Process each patient
    for (const patientId of patientIds) {
      try {
        const apiKey = await keyStore.get(patientId);
        if (!apiKey) {
          errors.push({ patientId, error: 'No Fitbit key linked for patient' });
          continue;
        }

        const [steps, heartRate, sleep] = await Promise.all([
          fitbitClient.getDailySteps(apiKey, patientId),
          fitbitClient.getRestingHeartRate(apiKey, patientId),
          fitbitClient.getSleepSummary(apiKey, patientId),
        ]);

        results.push({ patientId, steps, heartRate, sleep });
      } catch (err) {
        errors.push({ patientId, error: err.message });
      }
    }

    return res.status(200).json({ 
      data: results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) { next(err); }
}

module.exports = { linkKey, unlinkKey, getPatientSummary, getBatchPatientSummary };
