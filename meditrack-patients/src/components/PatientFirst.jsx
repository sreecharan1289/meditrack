import React, { useState, useRef } from 'react';
import '../App.css';
import logo from '../assets/images/m_logo.jpeg';
import bgImage from '../assets/images/mentor-details-back.jpg';
import docimg from '../assets/images/doctor.jpeg';

const PatientFirst = () => {
    const [showNewForm, setShowNewForm] = useState(false);
    const [showOldForm, setShowOldForm] = useState(false);
    const newHoverRef = useRef(null);
    const oldHoverRef = useRef(null);

    // New Patient Fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [condition, setCondition] = useState('');
    const [age, setAge] = useState('');
    const [symptoms, setSymptoms] = useState('');

    // Old Patient Login Fields
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const handleMouseEnterNew = () => {
        clearTimeout(newHoverRef.current);
        setShowNewForm(true);
    };

    const handleMouseLeaveNew = () => {
        newHoverRef.current = setTimeout(() => setShowNewForm(false), 1000);
    };

    const handleMouseEnterOld = () => {
        clearTimeout(oldHoverRef.current);
        setShowOldForm(true);
    };

    const handleMouseLeaveOld = () => {
        oldHoverRef.current = setTimeout(() => setShowOldForm(false), 1000);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const newPatient = {
            firstName, lastName, email, phone, password, gender, condition, age, symptoms,
        };

        try {
            const response = await fetch('http://localhost:5000/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPatient),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Patient registered successfully!');
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setPassword('');
                setGender('');
                setCondition('');
                setAge('');
                setSymptoms('');
            } else {
                alert(data.error || 'Error registering patient');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server.');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/patients/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Login successful!');
                // Redirect or next step
            } else {
                alert(data.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed.');
        }
    };

    return (
        <div className='p_1'>
            <img src={logo} alt="logo" className='m_logo' />
            <div className='vertical-line'></div>
            <div className='center-buttons'>
                {/* New Patient Button */}
                <button
                    className='btn'
                    onMouseEnter={handleMouseEnterNew}
                    onMouseLeave={handleMouseLeaveNew}
                >
                    New Patient
                </button>
                {showNewForm && (
                    <div className='hover-bridge' onMouseEnter={handleMouseEnterNew} onMouseLeave={handleMouseLeaveNew}></div>
                )}

                {/* Old Patient Button */}
                <button
                    className='btn'
                    onMouseEnter={handleMouseEnterOld}
                    onMouseLeave={handleMouseLeaveOld}
                >
                    Old Patient
                </button>
                {showOldForm && (
                    <div className='hover-bridge left-hover' onMouseEnter={handleMouseEnterOld} onMouseLeave={handleMouseLeaveOld}></div>
                )}


                <img src={bgImage} alt="background" className='background-image' />
            </div>

            {/* New Patient Form */}
            {showNewForm && (
                <div className='form-container' onMouseEnter={handleMouseEnterNew} onMouseLeave={handleMouseLeaveNew}>
                    <div className="container">
                        <div className="title">New Patient Details</div>
                        <div className="content">
                            <form onSubmit={handleRegister}>
                                <div className="user-details">
                                    <div className="input-box"><span className="details">First Name</span><input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Last Name</span><input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Phone Number</span><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Gender</span><input type="text" value={gender} onChange={(e) => setGender(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Condition</span><input type="text" value={condition} onChange={(e) => setCondition(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Age</span><input type="text" value={age} onChange={(e) => setAge(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Symptoms</span><input type="text" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} required /></div>
                                </div>
                                <div className="button"><input type="submit" value="Register" /></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Old Patient Login Form */}
            {showOldForm && (
                <div className='form-container old-patient-form' onMouseEnter={handleMouseEnterOld} onMouseLeave={handleMouseLeaveOld}>
                    <div className="old-patient-container">
                        <div className="title">Old Patient Login</div>
                        <div className="content">
                            <form onSubmit={handleLogin}>
                                <div className="user-details">
                                    <div className="input-box">
                                        <span className="details">Email</span>
                                        <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                                    </div>
                                    <div className="input-box">
                                        <span className="details">Password</span>
                                        <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="button"><input type="submit" value="Login" /></div>
                            </form>
                        </div>
                        {/* <div className="image-section">
                            <img src={docimg} alt="Doctor Illustration" />
                        </div> */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientFirst;
