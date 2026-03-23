import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaRocket, FaEye, FaEyeSlash } from 'react-icons/fa';
import {
    patientRegister,
    patientLogin
} from "../../../services/patientApi";

export default function PatientAuth() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState('email');
    const [userType, setUserType] = useState('patient');

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
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        gender: 'male'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            try {
                const payload = {
                    email: loginMethod === 'email' ? formData.email : null,
                    phone: loginMethod === 'phone' ? formData.phone : null,
                    password: formData.password
                };

                console.log("Login Payload:", payload);

                const response = await patientLogin(payload);

                console.log("Patient Login API:", response.data);

                const patient = response?.data?.data;

                localStorage.removeItem('is_website_admin');
                localStorage.removeItem('current_hospital_id');

                localStorage.setItem('is_patient_logged_in', 'true');

                if (patient?.email) {
                    localStorage.setItem('current_patient_email', patient.email);
                }

                if (patient?.id) {
                    localStorage.setItem('current_patient_id', patient.id);
                }

                alert('Welcome back! Login successful.');

                navigate('/');

            } catch (error) {
                console.error("Patient Login Error:", error.response?.data || error);
                alert(error.response?.data?.message || 'Login failed');
            }

        } else {

            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            try {
                const payload = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phoneNumber: formData.phone,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    gender: formData.gender
                };

                console.log("Register Payload:", payload);

                const response = await patientRegister(payload);

                console.log("Patient Register API:", response.data);

                const patient = response?.data?.data;

                localStorage.setItem('is_patient_logged_in', 'true');

                if (patient?.email) {
                    localStorage.setItem('current_patient_email', patient.email);
                }

                if (patient?.id) {
                    localStorage.setItem('current_patient_id', patient.id);
                }

                alert('Account created successfully!');

                navigate('/');

            } catch (error) {
                console.error("Patient Register Error:", error.response?.data || error);
                alert(error.response?.data?.message || 'Registration failed');
            }
        }
    };

    const handleUserTypeChange = (type) => {
        setUserType(type);

        if (type === 'hospital') {
            navigate('/hospital-auth');
        }
    };

    const switchMode = (login) => {
        setIsLogin(login);
        setLoginMethod('email');

        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            gender: 'male'
        });
    };

    return (
        <div className="registration-page">
            <div className="auth-container">

                <div className="auth-sidebar">
                    <div className="sidebar-logo">
                        <FaRocket />
                    </div>

                    <h1 className="sidebar-title">Welcome</h1>

                    <p className="sidebar-description">
                        {isLogin
                            ? "We're glad to see you again! Please login to continue."
                            : "Join us and start your health journey today."}
                    </p>
                </div>

                <div className="auth-content">
                    <div className="auth-header-wrapper">
                        <div className="auth-title-section">
                            <h2>{isLogin ? 'Sign In' : 'Register as Patient'}</h2>
                        </div>

                        <div className="pill-toggle">
                            <button
                                className={`pill-item ${userType === 'patient' ? 'active' : ''}`}
                                onClick={() => handleUserTypeChange('patient')}
                            >
                                Patient
                            </button>

                            <button
                                className={`pill-item ${userType === 'hospital' ? 'active' : ''}`}
                                onClick={() => handleUserTypeChange('hospital')}
                            >
                                Hospital
                            </button>
                        </div>
                    </div>

                    <form className="registration-form" onSubmit={handleSubmit}>
                        {isLogin ? (
                            <>
                                <div className="form-group">
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
                                        <label>Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <label>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
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
                                                border: 'none'
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
                                        <label>First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Password *</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Confirm Password *</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="auth-footer">
                            <button
                                type="button"
                                onClick={() => switchMode(!isLogin)}
                                className="auth-toggle-link"
                            >
                                {isLogin
                                    ? "Don't have an account? Register"
                                    : "Already have an account? Sign In"}
                            </button>

                            <button type="submit" className="submit-btn">
                                {isLogin ? 'Login' : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}