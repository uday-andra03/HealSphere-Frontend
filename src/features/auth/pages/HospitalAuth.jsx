import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaHospital, FaRocket, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { hospitals } from '../../hospitals/data/hospitalsData';
import { hospitalRegister ,hospitalLogin} from '../../../services/hospitalApi';
import '../styles/DoctorRegistration.css';

export default function HospitalAuth() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState('email');
    const [userType, setUserType] = useState('hospital');

    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'signup') {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
        sessionStorage.setItem('hasVisitedAuth', 'true');
    }, [searchParams]);

    const [formData, setFormData] = useState({
        hospitalName: '',
        adminEmail: '',
        phone: '',
        password: '',
        confirmPassword: '',
        location: '',
        established: '',
        beds: '',
        about: '',
        specializations: '',
        doctors: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUserTypeChange = (type) => {
        setUserType(type);
        if (type === 'patient') navigate('/patient-auth');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {

    const loginData = {
        email: formData.adminEmail,
        password: formData.password
    };

    try {

        const response = await hospitalLogin(loginData);

        console.log("Login response:", response);

        const token = response.data.token;

        // important for navbar
         localStorage.setItem("current_hospital_id", "logged_in");

        alert("Login successful");

        // redirect to activity dashboard
        navigate("/dashboard");

    } catch (error) {

        console.error("Login error:", error);

        alert("Invalid email or password");

    }

}

         else {

            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // ✅ Correct mapping according to HospitalRegistrationRequest
            const hospitalData = {

                name: formData.hospitalName,

                address: formData.location,
                city: formData.location,
                state: "Telangana",
                country: "India",

                phone: formData.phone,

                email: formData.adminEmail,

                password: formData.password,
                confirmPassword: formData.confirmPassword,

                establishedYear: parseInt(formData.established) || 0,

                totalBeds: parseInt(formData.beds) || 0,

                specializations: formData.specializations
                    ? formData.specializations.split(',').map(s => s.trim())
                    : [],

                doctors: formData.doctors
                    ? formData.doctors.split(',').map(d => d.trim())
                    : [],

                aboutHospital: formData.about,

                rooms: []
            };

            try {

                const response = await hospitalRegister(hospitalData);

                console.log("Hospital saved in database:", response);

                alert("Registration successful! Your hospital has been added.");

                navigate("/");

            } catch (error) {

                console.error("Registration Error:", error);

                alert("Registration Failed");

            }
        }
    };

    const switchMode = (login) => {
        setIsLogin(login);
        setLoginMethod('email');
        setFormData({
            hospitalName: '',
            adminEmail: '',
            phone: '',
            password: '',
            confirmPassword: '',
            location: '',
            established: '',
            beds: '',
            about: '',
            specializations: '',
            doctors: ''
        });
    };

    return (
        <div className="registration-page">
            <div className="auth-container">

                <div className="auth-sidebar">
                    <div className="sidebar-logo">
                        <FaHospital />
                    </div>
                    <h1 className="sidebar-title">HealSphere</h1>
                    <p className="sidebar-description">
                        {isLogin
                            ? "Dedicated administrative portal for healthcare facilities."
                            : "Partner with us to provide world-class healthcare."}
                    </p>
                </div>

                <div className="auth-content">

                    <div className="auth-header-wrapper">

                        <div className="auth-title-section">
                            <h2>{isLogin ? 'Hospital Sign In' : 'Register'}</h2>
                        </div>

                        <div className="pill-toggle">
                            <button className="pill-item" onClick={() => handleUserTypeChange('patient')}>Patient</button>
                            <button className="pill-item active">Hospital</button>
                        </div>

                    </div>

                    <form className="registration-form" onSubmit={handleSubmit}>

                        {isLogin ? (
                            <>
                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                    <label>Sign in with</label>
                                    <div className="method-toggle">
                                        <button
                                            type="button"
                                            className={`method-btn ${loginMethod === 'email' ? 'active' : ''}`}
                                            onClick={() => setLoginMethod('email')}
                                        >
                                            Email
                                        </button>
                                        <button
                                            type="button"
                                            className={`method-btn ${loginMethod === 'phone' ? 'active' : ''}`}
                                            onClick={() => setLoginMethod('phone')}
                                        >
                                            Phone
                                        </button>
                                    </div>
                                </div>

                                {loginMethod === 'email' ? (
                                    <div className="form-group">
                                        <label>Administrative Email *</label>
                                        <input
                                            type="email"
                                            name="adminEmail"
                                            placeholder="admin@hospital.com"
                                            required
                                            value={formData.adminEmail}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <label>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="+1 (555) 000-0000"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Password *</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="••••••••"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            style={{ paddingRight: '45px' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '15px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>Hospital Name *</label>
                                        <input
                                            type="text"
                                            name="hospitalName"
                                            placeholder="City General Hospital"
                                            required
                                            value={formData.hospitalName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Admin Email *</label>
                                        <input
                                            type="email"
                                            name="adminEmail"
                                            placeholder="admin@hospital.com"
                                            required
                                            value={formData.adminEmail}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Contact Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Location *</label>
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="NY, USA"
                                            required
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Established Year</label>
                                        <input
                                            type="number"
                                            name="established"
                                            placeholder="1990"
                                            value={formData.established}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Bed Capacity</label>
                                        <input
                                            type="number"
                                            name="beds"
                                            placeholder="500"
                                            value={formData.beds}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Specializations</label>
                                        <input
                                            type="text"
                                            name="specializations"
                                            placeholder="Cardiology, Oncology..."
                                            value={formData.specializations}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Doctor List</label>
                                        <input
                                            type="text"
                                            name="doctors"
                                            placeholder="Dr. Smith, Dr. Jones..."
                                            value={formData.doctors}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Password *</label>
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Confirm Password *</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>

                                <div className="form-group">
                                    <label>About the Hospital</label>
                                    <textarea
                                        name="about"
                                        rows="3"
                                        value={formData.about}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                            </>
                        )}

                        <div className="auth-footer">
                            <button
                                type="button"
                                onClick={() => switchMode(!isLogin)}
                                className="auth-toggle-link"
                            >
                                {isLogin ? "Don't have an account? Register" : "Already registered? Sign In"}
                            </button>

                            <button type="submit" className="submit-btn" style={{ float: 'right' }}>
                                {isLogin ? 'Sign In' : 'Register'}
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}