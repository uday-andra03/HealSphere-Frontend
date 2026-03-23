import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaMars,
  FaVenus,
  FaSignOutAlt,
  FaTrash
} from "react-icons/fa";

import "../styles/DoctorRegistration.css";

import api from "../../../services/api";

import {
  updatePatient,
  deletePatient,
  patientLogout
} from "../../../services/patientApi";

export default function PatientProfile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male",
    password: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const patientId = localStorage.getItem("current_patient_id");

      if (!patientId) {
        alert("Patient not logged in");
        navigate("/patient-auth");
        return;
      }

      const res = await api.get(`/api/admin/patients/${patientId}`);

      const patient = res?.data?.data || {};

      setPatientData({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        email: patient.email || "",
        phone: patient.phoneNumber || "",
        gender: patient.gender || "male",
        password: patient.password || ""
      });

    } catch (error) {
      console.error("Profile Load Error:", error);
      alert("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const patientId = localStorage.getItem("current_patient_id");

      const payload = {
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        email: patientData.email,
        phoneNumber: patientData.phone,
        password: patientData.password,
        gender: patientData.gender
      };

      const res = await updatePatient(patientId, payload);

      console.log("Update Response:", res.data);

      alert("Profile updated successfully");

      setIsEditing(false);

      fetchProfile();

    } catch (error) {
      console.error("Update Error:", error.response?.data || error);
      alert("Update failed");
    }
  };

  const handleLogout = async () => {
    try {
      await patientLogout();

      localStorage.removeItem("is_patient_logged_in");
      localStorage.removeItem("current_patient_email");
      localStorage.removeItem("current_patient_id");

      alert("Logged out successfully");

      navigate("/patient-auth");

    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const patientId = localStorage.getItem("current_patient_id");

      await deletePatient(patientId);

      localStorage.removeItem("is_patient_logged_in");
      localStorage.removeItem("current_patient_email");
      localStorage.removeItem("current_patient_id");

      alert("Account deleted successfully");

      navigate("/");

    } catch (error) {
      console.error("Delete Error:", error.response?.data || error);
      alert("Delete failed");
    }
  };

  return (
    <div className="registration-page">
      <div className="auth-container" style={{ maxWidth: "950px" }}>

        <div
          className="auth-sidebar"
          style={{
            background: "linear-gradient(135deg, #3cd2d7 0%, #4dd1e2 100%)"
          }}
        >
          <div className="sidebar-logo">
            <FaUser />
          </div>

          <h1 className="sidebar-title">Patient Profile</h1>

          <p className="sidebar-description">
            Manage your profile securely and keep your health information updated.
          </p>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={() => navigate(-1)}
              className="auth-toggle-link"
              style={{
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none"
              }}
            >
              <FaArrowLeft /> Back
            </button>

            <button
              onClick={handleLogout}
              className="auth-toggle-link"
              style={{
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none"
              }}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        <div className="auth-content">
          <div className="auth-header-wrapper">
            <div className="auth-title-section">
              <h2>Account Settings</h2>
              <p style={{ color: "#64748b" }}>
                Update your personal profile
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="submit-btn"
              style={{
                width: "auto",
                padding: "8px 20px",
                background: isEditing ? "#ef4444" : "#3cd2d7"
              }}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <form className="registration-form" onSubmit={handleSave}>
            <div className="form-grid">

              <div className="form-group">
                <label><FaUser /> First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={patientData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label><FaUser /> Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={patientData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label><FaEnvelope /> Email</label>
                <input
                  type="email"
                  value={patientData.email}
                  disabled
                />
              </div>

              <div className="form-group">
                <label><FaPhone /> Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={patientData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Gender</label>

              <div className="gender-selection">
                <label className="radio-group">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={patientData.gender === "male"}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <FaMars /> Male
                </label>

                <label className="radio-group">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={patientData.gender === "female"}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <FaVenus /> Female
                </label>
              </div>
            </div>

            <div className="form-group">
              <label><FaLock /> Password</label>

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={patientData.password}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{ paddingRight: "45px" }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none"
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {isEditing && (
              <div className="auth-footer" style={{ display: "flex", gap: "12px" }}>
                <button type="submit" className="submit-btn" style={{ flex: 1 }}>
                  <FaSave /> Save Changes
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="submit-btn"
                  style={{ flex: 1, background: "#ef4444" }}
                >
                  <FaTrash /> Delete Account
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
