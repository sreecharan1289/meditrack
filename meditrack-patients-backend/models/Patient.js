const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: String,
  phone: String,
  password: String,
  gender: String,
  condition: String,
  age: Number,
  symptoms: String,
  children:{type:String, required:true}
});

module.exports = mongoose.model('Patient', patientSchema);
