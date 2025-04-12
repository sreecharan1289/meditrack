// routes/patients.js
const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient'); // Adjust if your model file name is different

router.post('/', async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const patient = await Patient.findOne({ email, password });
      if (!patient) {
          return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.json({ message: 'Login successful', patient });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
