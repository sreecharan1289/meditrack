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
// PATCH /api/patients/:id from inside appointmentRoutes.js
router.patch('/patients/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: "Error updating patient", error: error.message });
  }
});

  // Create a new appointment
  // Correct add route
router.post('/add', async (req, res) => {
  try {
    const { patient, doctor, currentAppointmentDate } = req.body;

    if (!currentAppointmentDate || isNaN(new Date(currentAppointmentDate))) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const newAppointment = new Appointment({
      patient,
      doctor,
      currentAppointmentDate: new Date(currentAppointmentDate),
      isActive: true
    });

    const savedAppointment = await newAppointment.save();
    return res.status(201).json(savedAppointment); // ✅ proper JSON response
  } catch (err) {
    console.error('Error saving appointment:', err);
    return res.status(500).json({ error: 'Server error' }); // ✅ proper error format
  }
});


  // Get appointments by patient ID
// In appointmentRoutes.js, update the population for patient appointments
router.get("/patient/:patientId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.patientId })
      .populate({
        path: 'doctor',
        select: 'name specialization' // Only get necessary fields
      })
      .sort({ currentAppointmentDate: -1 });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching appointments", error: err.message });
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
router.get("/:id", async (req, res) => {
  const appt = await Appointment.findById(req.params.id).populate("doctor patient");
  res.json(appt);
});


module.exports = router;
module.exports.Appointment = Appointment;