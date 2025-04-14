const express = require('express');
const mongoose = require("mongoose");
const Patient = require("./patient");
const Doctor = require("./doctor");
const router = express.Router();

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, default: null },
  doctorName: { type: String, default: null },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  lastAppointmentDate: {
    type: Date,
    default: null
  },
  currentAppointmentDate: {
    type: Date,
    required: true,
  },
  nextAppointmentDate: {
    type: Date,
    default: null
  },
  report: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isReportGenerated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});



// 🧠 Middleware to auto-fill doctorName and patientName
appointmentSchema.pre("save", async function (next) {
  if (!this.isModified("doctor") && !this.isModified("patient")) {
    return next(); // Skip if doctor/patient not modified
  }

  try {
    const doctor = await Doctor.findById(this.doctor);
    const patient = await Patient.findById(this.patient);

    if (doctor) this.doctorName = doctor.name;
    if (patient) this.patientName = patient.name;

    next();
  } catch (err) {
    console.error("❌ Error populating names in appointment:", err.message);
    next(err);
  }
});

// Add new appointment to patient's appointment list & set activeAppointment
appointmentSchema.post("save", async function (doc, next) {
  try {
    const appointmentEntry = {
      date: doc.currentAppointmentDate,
      status: doc.isActive ? "upcoming" : "past",
      appointmentId: doc._id
    };

    await Patient.findByIdAndUpdate(doc.patient, {
      $push: { appointments: appointmentEntry },
      $set: { activeAppointment: doc._id }
    });

    next();
  } catch (err) {
    console.error("❌ Error updating patient's appointment list:", err.message);
    next(err);
  }
});

// Clear activeAppointment if appointment becomes inactive
appointmentSchema.post("save", async function (doc, next) {
  try {
    if (!doc.isActive) {
      const patient = await Patient.findById(doc.patient);
  
      console.log("Checking if activeAppointment should be cleared");
  
      if (patient && patient.activeAppointment?.toString() === doc._id.toString()) {
        patient.activeAppointment = null;
        await patient.save();
        console.log("✅ Cleared activeAppointment for patient", patient._id);
      }
    }

    next();
  } catch (err) {
    console.error("❌ Error clearing activeAppointment:", err.message);
    next(err);
  }
});

// Export Appointment model and router
const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;