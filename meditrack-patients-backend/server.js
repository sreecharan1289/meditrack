const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const patientRoutes = require('./routes/patients'); // Make sure this path is correct

const app = express();
app.use(cors());
app.use(express.json()); // Important to parse JSON

// Route middleware
app.use('/api/patients', patientRoutes); // <--- this line registers your route

mongoose.connect('mongodb://127.0.0.1:27017/meditrackDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected!");
}).catch(err => {
  console.log("MongoDB connection error:", err);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
