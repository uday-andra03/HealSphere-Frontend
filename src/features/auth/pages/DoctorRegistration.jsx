import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DoctorRegistration.css';
import { addDoctor } from "../../../services/doctorApi";
import { getAdminHospitals } from "../../../services/adminApi";

export default function DoctorRegistration() {
  const navigate = useNavigate();

  const [backendHospitals, setBackendHospitals] = useState([]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    hospital: '',
    specialization: '',
    qualifications: '',
    bio: '',
    password: '',
    hospitalId: '',
    specializationId: '',
    consultationFee: ''
  });

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      const response = await getAdminHospitals();

      const hospitals =
        response?.data?.data?.["Hospital list"] || [];

      setBackendHospitals(hospitals);

    } catch (error) {
      console.error("Hospital API Error:", error);
      setBackendHospitals([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "hospital") {
      const selectedHospital = backendHospitals.find(
        (h) => String(h.id) === value
      );

      setFormData(prev => ({
        ...prev,
        hospital: value,
        hospitalId: selectedHospital?.id || ''
      }));

      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const doctorPayload = {
        doctorName: formData.fullName,
        doctorEmail: formData.email,
        password: formData.password || "doctor123",
        qualification: formData.qualifications,
        experience: Number(formData.experience),
        description: formData.bio,
        phoneNo: formData.phone,
        hospitalId: Number(formData.hospitalId),
        specializationId: Number(formData.specializationId || 1),
        specializationName: formData.specialization,
        consultationFee: Number(formData.consultationFee || 500)
      };

      const response = await addDoctor(doctorPayload);

      alert("Doctor added successfully");
      console.log("Doctor API Response:", response.data);

      navigate("/dashboard");

    } catch (error) {
      console.error("Doctor API Error:", error);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-header" style={{ position: 'relative' }}>
        <h1 className="registration-title">Doctor Registration</h1>
        <p className="registration-subtitle">Join our network of healthcare professionals</p>
      </div>

      <div className="registration-card">
        <div className="registration-card__header">
          <h2 className="registration-card__title">Personal Information</h2>
          <p className="registration-card__subtitle">Fill in your details to get started</p>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Dr. John Smith"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="doctor@email.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience">Years of Experience</label>
              <input
                type="number"
                id="experience"
                name="experience"
                placeholder="10"
                min="0"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hospital">Hospital *</label>
              <select
                id="hospital"
                name="hospital"
                required
                value={formData.hospital}
                onChange={handleChange}
              >
                <option value="">Select hospital</option>

                {backendHospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="specialization">Specialization *</label>
              <select
                id="specialization"
                name="specialization"
                required
                value={formData.specialization}
                onChange={handleChange}
              >
                <option value="">Select specialization</option>
                <option value="cardiology">Cardiology</option>
                <option value="dermatology">Dermatology</option>
                <option value="neurology">Neurology</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="oncology">Oncology</option>
              </select>
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>

            <div className="form-group">
              <label>Specialization ID</label>
              <input
                type="number"
                name="specializationId"
                value={formData.specializationId}
                onChange={handleChange}
                placeholder="1"
              />
            </div>

            <div className="form-group">
              <label>Consultation Fee</label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                placeholder="500"
              />
            </div>

          </div>

          <div className="form-group full-width">
            <label htmlFor="qualifications">Qualifications</label>
            <input
              type="text"
              id="qualifications"
              name="qualifications"
              placeholder="MBBS, MD, FRCS..."
              value={formData.qualifications}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="bio">Short Bio</label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell us about your practice and expertise..."
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  );
}
