import React, { useState, useEffect } from 'react';
import NavbarPatient from './Navbarpatient';
import '../App.css';
import logo from '../assets/images/m_logo.jpeg';
import { fetchDoctors } from '../apiService'; // adjust path as needed

const Dashboard = () => {
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

    loadDoctors();
  }, []);

  const handleDateChange = (e, doctorName) => {
    setSelectedDate(prev => ({
      ...prev,
      [doctorName]: e.target.value
    }));
  };

  const handleBook = (doctorName) => {
    const date = selectedDate[doctorName];
    if (date) {
      alert(`Appointment booked with ${doctorName} on ${date}`);
    } else {
      alert(`Please select a date for ${doctorName}`);
    }
  };

  return (
    <div className="dashboard-container">
      <NavbarPatient navbarColor="#649cac" logoUrl={logo} />
      <div className="dashboard-content">
      <h1 className="left-aligned-heading">Hello, Sree Charan!</h1>
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
              <button onClick={() => handleBook(doc.name)}>Book</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
