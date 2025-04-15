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
  pdfReport: {
    file: { 
      type: String,
      validate: {
        validator: function(v) {
          // Basic PDF validation (first 6 chars should be 'JVBERi')
          return !v || v.startsWith('JVBERi');
        },
        message: 'Uploaded file is not a valid PDF'
      }
    },
    uploadedAt: {
      type: Date,
      default: null
    }
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



appointmentSchema.post("save", async function (doc, next) {
  try {
    // Auto-fill doctorName and patientName
    const [doctor, patient] = await Promise.all([
      Doctor.findById(doc.doctor),
      Patient.findById(doc.patient),
    ]);

    if (doctor && !doc.doctorName) doc.doctorName = doctor.name;
    if (patient && !doc.patientName) doc.patientName = patient.name;

    // Build the appointment entry
    const appointmentEntry = {
      date: doc.currentAppointmentDate,
      status: doc.isActive ? "upcoming" : "past",
      appointmentId: doc._id
    };

    // Prepare update payload
    const update = {
      $push: { appointments: appointmentEntry },
      $set: {}
    };

    // Always update activeAppointment (if active)
    if (doc.isActive) {
      update.$set.activeAppointment = doc._id;
    }

    // Assign doctor if patient is new and unassigned
    if (patient && patient.isNew && !patient.doctor) {
      update.$set.doctor = doc.doctor;
    }

    // Mark isNew = false if this is the 2nd appointment
    if (patient && patient.appointments.length >= 1) {
      update.$set.isNew = false;
    }

    // Clear activeAppointment if this appointment is now inactive
    if (!doc.isActive && patient?.activeAppointment?.toString() === doc._id.toString()) {
      update.$set.activeAppointment = null;
    }

    // Apply update
    await Patient.findByIdAndUpdate(doc.patient, update);
    next();
  } catch (err) {
    console.error("❌ Unified middleware error:", err.message);
    next(err);
  }
});
appointmentSchema.pre("save", async function (next) {
  try {
    // Auto-fill doctorName and patientName
    if (!this.doctorName) {
      const doctor = await Doctor.findById(this.doctor);
      if (doctor) this.doctorName = doctor.name;
    }

    if (!this.patientName) {
      const patient = await Patient.findById(this.patient);
      if (patient) this.patientName = patient.name;
    }

    next();
  } catch (err) {
    console.error("❌ Error in pre-save hook:", err.message);
    next(err);
  }
});



// Export Appointment model and router
const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;