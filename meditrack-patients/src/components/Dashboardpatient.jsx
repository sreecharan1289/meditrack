import React, { useState, useEffect } from 'react';
import NavbarPatient from './Navbarpatient';
import '../App.css';
import logo from '../assets/images/m_logo.jpeg';
import { fetchDoctors, bookAppointment } from '../apiService'; // ✅ Ensure bookAppointment is imported

const Dashboard = () => {
  const [patientInfo, setPatientInfo] = useState('');
  const [selectedDate, setSelectedDate] = useState({});
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorData = await fetchDoctors();
        setDoctors(doctorData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const loadPatientInfo = () => {
      const stored = localStorage.getItem('patientInfo');
      if (stored) {
        setPatientInfo(JSON.parse(stored));
      }
    };

    loadDoctors();
    loadPatientInfo();
  }, []);

  const handleDateChange = (e, doctorName) => {
    setSelectedDate(prev => ({
      ...prev,
      [doctorName]: e.target.value,
    }));
  };

  const handleBook = async (doctor) => {
    const date = selectedDate[doctor.name];
    if (!date) {
      alert(`Please select a date for Dr. ${doctor.name}`);
      return;
    }

    const appointmentData = {
      patient: patientInfo?._id, // ✅ patientId from state
      doctor: doctor._id,
      currentAppointmentDate: date, // ✅ specific doctor’s selected date
    };

    try {
      const res = await bookAppointment(appointmentData);
      console.log(`✅ Appointment booked with Dr. ${doctor.name}`, res);
    
      // Store appointment or just refresh patientInfo in localStorage
      localStorage.setItem('latestAppointment', JSON.stringify(res));
      
      // Optional: Also ensure patientInfo is stored again (if you worry about state loss)
      if (patientInfo?._id) {
        localStorage.setItem('patientId', patientInfo._id); // 🔐 Save ID for later fetch
      }
    
      alert(`Appointment successfully booked with Dr. ${doctor.name} on ${date}`);
    } catch (err) {
      console.error("❌ Booking error:", err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <NavbarPatient navbarColor="#649cac" logoUrl={logo} />
      <div className="dashboard-content">
        <h1 className="left-aligned-heading">
          Hello, {patientInfo?.name || "Patient"}!
        </h1>
        <h2 className="appointment-heading">Book Appointments</h2>
        <div className="appointment-tiles">
          {doctors.map((doc, idx) => (
            <div className="appointment-tile" key={idx}>
              <h3>{doc.name}</h3>
              <p>{doc.specialization}</p>
              <input
                type="date"
                value={selectedDate[doc.name] || ''}
                onChange={(e) => handleDateChange(e, doc.name)}
              />
              <button onClick={() => handleBook(doc)}>Book</button> {/* ✅ pass full doc */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
