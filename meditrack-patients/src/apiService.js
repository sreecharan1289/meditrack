const API_URL = 'http://localhost:5000';

export const fetchDoctors = async () => {
  const response = await fetch(`${API_URL}/api/doctors`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch doctors');
  }
  return data;
};

export const registerPatient = async (patientData) => {
  const response = await fetch(`${API_URL}/api/patients/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData),
  });

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error("Expected JSON but got:", text);
    throw new Error('Unexpected response from server. Check backend route.');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
};

export const loginPatient = async (credentials) => {
  const response = await fetch(`${API_URL}/api/patients/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error("Expected JSON but got:", text);
    throw new Error('Unexpected response from server. Check backend route.');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
};

export const bookAppointment = async (appointmentData) => {
  console.log('Booking appointment with data:', appointmentData);

  const response = await fetch(`${API_URL}/api/appointments/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(appointmentData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to book appointment');
  }

  return data;
};


export const fetchPatientAppointments = async (patientId) => {
  const response = await fetch(`${API_URL}/api/appointments/patient/${patientId}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch appointments');
  }

  return data;
};
export const fetchPatient = async (patientId) => {
  const response = await fetch(`${API_URL}/api/patients/${patientId}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch patient data');
  }

  return data;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('patientToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
