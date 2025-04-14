import { useEffect, useState } from 'react';
import { fetchPatientAppointments } from '../apiService';
import NavbarPatient from './Navbarpatient';
import '../App.css';

const Appointmentspatient = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const storedId = patientId || localStorage.getItem('patientId');
    if (!storedId) {
      console.warn("⚠️ No patientId available to fetch appointments.");
      return;
    }

    const getAppointments = async () => {
      try {
        const data = await fetchPatientAppointments(storedId);
        setAppointments(data);
        const active = data.find(appt => appt.isActive);
        setActiveAppointment(active || null);
      } catch (error) {
        console.error('❌ Failed to load appointments:', error);
      }
    };

    getAppointments();
  }, [patientId]);

  const handleDownload = (appointment) => {
    alert(`Download report for appointment with Dr. ${appointment.doctor?.name}`);
  };

  const toggleExpand = (id, field) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: !prev[id]?.[field]
      }
    }));
  };

  return (
    <>
      <NavbarPatient />
      <div className="patientappointments-container">
        <h1 className="appointments-title">All Appointments!</h1>

        <div className="appointments-main">
          {/* Left: All Appointments */}
          <div className="appointments-list">
            {appointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              appointments.map((appt) => (
                <div key={appt._id} className="appointment-card">
                  <p><strong>Doctor:</strong> Dr. {appt.doctor?.name || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(appt.currentAppointmentDate).toLocaleString()}</p>
                  
                  <div className="action-buttons">
                    <button 
                      className="view-btn"
                      onClick={() => toggleExpand(appt._id, 'report')}
                    >
                      {expandedItems[appt._id]?.report ? 'Hide Report' : 'View Report'}
                    </button>
                    <button 
                      className="view-btn"
                      onClick={() => toggleExpand(appt._id, 'notes')}
                    >
                      {expandedItems[appt._id]?.notes ? 'Hide Notes' : 'View Notes'}
                    </button>
                    <button 
                      className="download-btn" 
                      onClick={() => handleDownload(appt)}
                    >
                      Download Report
                    </button>
                  </div>

                  {expandedItems[appt._id]?.report && (
                    <div className="expanded-content">
                      <strong>Report:</strong> {appt.report || 'Null'}
                    </div>
                  )}
                  {expandedItems[appt._id]?.notes && (
                    <div className="expanded-content">
                      <strong>Notes:</strong> {appt.notes || 'Null'}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Right: Active Appointment */}
          <div className="active-appointment-section">
            {activeAppointment ? (
              <div className="active-appointment-card">
                <h2>Active Appointment</h2>
                <p><strong>Doctor:</strong> Dr. {activeAppointment.doctor?.name}</p>
                <p><strong>Date:</strong> {new Date(activeAppointment.currentAppointmentDate).toLocaleString()}</p>
                <p><strong>Notes:</strong> {activeAppointment.notes || 'Null'}</p>
                <button 
                  className="download-btn" 
                  onClick={() => handleDownload(activeAppointment)}
                >
                  Download Report
                </button>
              </div>
            ) : (
              <div className="active-appointment-card">
                <h2>Active Appointment</h2>
                <p>No active appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointmentspatient;