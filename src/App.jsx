import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Hospitals from './features/hospitals/pages/Hospitals';
import HospitalDetails from './features/hospitals/pages/HospitalDetails';
import About from './pages/About';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import './App.css';
import './features/hospitals/styles/hospitals.css';

import PatientAuth from './features/auth/pages/PatientAuth';
import HospitalAuth from './features/auth/pages/HospitalAuth';
import Dashboard from './features/dashboard/pages/Dashboard';
import HospitalProfile from './features/hospitals/pages/HospitalProfile';
import DoctorRegistration from './features/auth/pages/DoctorRegistration';
import PatientProfile from './features/auth/pages/PatientProfile';
import Help from './pages/Help';
import ScrollToTop from './components/common/ScrollToTop';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

const ProtectedRoute = ({ children }) => {
  const isHospitalLoggedIn = !!localStorage.getItem('current_hospital_id');
  const isWebsiteAdmin = localStorage.getItem('is_website_admin') === 'true';
  const isPatientLoggedIn = localStorage.getItem('is_patient_logged_in') === 'true';
  const isLoggedIn = isHospitalLoggedIn || isWebsiteAdmin || isPatientLoggedIn;

  if (!isLoggedIn) {
    return <Navigate to="/patient-auth" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/patient-auth" element={<PatientAuth />} />
            <Route path="/hospital-auth" element={<HospitalAuth />} />

            {/* Protected Routes */}
            <Route path="/hospitals" element={<ProtectedRoute><Hospitals /></ProtectedRoute>} />
            <Route path="/hospital/:id" element={<ProtectedRoute><HospitalDetails /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/hospital-profile" element={<ProtectedRoute><HospitalProfile /></ProtectedRoute>} />
            <Route path="/patient-profile" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
            <Route path="/doctor-registration" element={<ProtectedRoute><DoctorRegistration /></ProtectedRoute>} />

            {/* Fallback to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
