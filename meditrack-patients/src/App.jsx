import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboardpatient';
import PatientFirst from './components/PatientFirst';
import NavBar from './components/Navbarpatient';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<PatientFirst />} /> */}
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/" element={<NavBar />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
