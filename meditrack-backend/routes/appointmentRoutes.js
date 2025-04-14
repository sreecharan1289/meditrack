const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");
const Patient = require("../models/patient");

// Create appointment
router.post("/", async (req, res) => {
    try {
        const appointment = new Appointment(req.body);
        await appointment.save();
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: "Failed to create appointment", error: err.message });
    }
});

// Get all appointments for a doctor
router.get("/doctor/:doctorId", async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.params.doctorId }).populate("patient").sort({ currentAppointmentDate: -1 });
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching appointments", error: err.message });
    }
});

// Get all appointments for a patient
router.get("/patient/:patientId", async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.params.patientId }).populate("doctor").sort({ currentAppointmentDate: -1 });
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching appointments", error: err.message });
    }
});

// 1️⃣ Get all patients with active appointments for a doctor
router.get("/active/doctor/:doctorId", async (req, res) => {
    try {
      const appointments = await Appointment.find({
        doctor: req.params.doctorId,
        isActive: true
      });
  
      const patientIds = [...new Set(appointments.map(app => app.patient.toString()))];
      const patients = await Patient.find({ _id: { $in: patientIds } });
  
      res.status(200).json(patients);
    } catch (err) {
      res.status(500).json({
        message: "Error fetching active appointment patients",
        error: err.message
      });
    }
  });
  // Create a new appointment
router.post('/add', async (req, res) => {
    try {
      const { patient, doctor, currentAppointmentDate } = req.body;
  
      const newAppointment = new Appointment({
        patient,
        doctor,
        currentAppointmentDate,
      });
  
      const savedAppointment = await newAppointment.save();
      res.status(201).json(savedAppointment);
    } catch (err) {
      console.error('Error saving appointment:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Get appointments by patient ID
router.get('/patient/:patientId', async (req, res) => {
    try {
      const appointments = await Appointment.find({ patient: req.params.patientId });
      res.json(appointments);
    } catch (err) {
      console.error('❌ Error fetching appointments:', err.message);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  });

// 2️⃣ Get appointments where isActive=true AND isReportGenerated=false
router.get("/pending-reports", async (req, res) => {
    try {
        const appointments = await Appointment.find({
            isActive: true,
            isReportGenerated: false,
        }).populate("doctor patient").sort({ currentAppointmentDate: -1 });

        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching pending report appointments", error: err.message });
    }
});

module.exports = router;
module.exports.Appointment = Appointment;