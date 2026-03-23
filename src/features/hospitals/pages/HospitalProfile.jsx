import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    FaEdit, FaSave, FaPlus, FaTrash, FaHospital, FaMapMarkerAlt,
    FaPhone, FaEnvelope, FaInfoCircle, FaSignOutAlt, FaUserMd,
    FaLock, FaEye, FaEyeSlash
} from 'react-icons/fa';
import '../../auth/styles/DoctorRegistration.css';

import {
    getHospitalCredentials,
    resetHospitalPassword,
    addSpecializationApi,
    getSpecializationsApi,
    deleteSpecializationApi,
    getHospitalById
} from "../../../services/hospitalApi";
import {
    addDoctor as addDoctorApi,
    updateDoctor as updateDoctorApi,
    deleteDoctor as deleteDoctorApi,
    getDoctorsByHospitalId
} from "../../../services/doctorApi";
export default function HospitalProfile() {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [specializationList, setSpecializationList] = useState([]);
    const [hospitalData, setHospitalData] = useState({
        id: null,
        name: '',
        location: '',
        phone: '',
        email: '',
        about: '',
        established: '',
        beds: '',
        doctors: '',
        specializations: [],
        doctorsList: []
    });

    const [newSpec, setNewSpec] = useState('');
    const [newDr, setNewDr] = useState({ name: '', specialty: '' });

    const [searchParams] = useSearchParams();
    const urlId = searchParams.get('id');

    useEffect(() => {
        const isSystemAdmin =
            localStorage.getItem('system_admin_mode') === 'true' ||
            localStorage.getItem('is_website_admin') === 'true';

        const currentHospitalId = Number(localStorage.getItem('current_hospital_id'));

        const targetId =
            isSystemAdmin && urlId
                ? Number(urlId)
                : currentHospitalId;

        if (targetId && !isNaN(targetId)) {
            loadHospitalProfile(targetId);
            loadCredentials(targetId);
        }

    }, [urlId, navigate]);


    const loadHospitalProfile = async (hospitalId) => {
        try {
            const response = await getHospitalById(hospitalId);
            const doctorsResponse = await getDoctorsByHospitalId(hospitalId);

            const hospital =
                response?.data?.data ||
                response?.data ||
                {};

            const doctors =
                doctorsResponse?.data?.data || [];
            console.log("Doctors API:", doctors);
            setHospitalData(prev => ({
                ...prev,
                id: hospital.id,
                name: hospital.name || hospital.hospitalName || '',
                location:
                    hospital.location ||
                    `${hospital.city || ''}, ${hospital.state || ''}`,
                phone: hospital.phone || hospital.hospitalPhone || '',
                email: hospital.email || hospital.hospitalEmail || '',
                about: hospital.aboutHospital || hospital.about || '',
                established: hospital.established || '',
                beds: hospital.totalBeds || hospital.beds || 0,
                doctors: doctors.length,
                specializations: hospital.specializations || [],
                doctorsList: doctors
                    .filter(d => String(d.isActive ?? d.is_active ?? "1") !== "inActive")
                    .map(d => ({
                        doctorId: d.id,
                        name: d.name,
                        specialty: d.specializationName
                    }))
            }));

        } catch (error) {
            console.error("Hospital Profile API Error:", error);
        }
    };

    const loadCredentials = async (hospitalId) => {
        try {
            const response = await getHospitalCredentials(hospitalId);

            const creds =
                response?.data?.data?.hospitalCredentials || {};

            setHospitalData(prev => ({
                ...prev,
                email: creds.email || prev.email,
                phone: creds.phone || prev.phone,
                name: creds.hospitalName || prev.name
            }));

            console.log('Hospital Credentials:', creds);

        } catch (error) {
            console.error('Credentials API Error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHospitalData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setIsEditing(false);

        // Always keep doctors count in sync with doctorsList length
        const updatedData = {
            ...hospitalData,
            doctors: hospitalData.doctorsList.length
        };

        const registeredHospitals = JSON.parse(
            localStorage.getItem('registered_hospitals') || '[]'
        );

        const index = registeredHospitals.findIndex(
            h => h.id.toString() === updatedData.id.toString()
        );

        // Reset password API only for numeric backend hospital id
        if (!isNaN(updatedData.id) && updatedData.password) {
            try {
                await resetHospitalPassword(
                    updatedData.id,
                    updatedData.password
                );

                console.log('Password reset successful');
            } catch (error) {
                console.error('Reset Password API Error:', error);
            }
        }

        if (index !== -1) {
            registeredHospitals[index] = updatedData;
            localStorage.setItem(
                'registered_hospitals',
                JSON.stringify(registeredHospitals)
            );
            alert('Hospital profile updated successfully!');
        } else {
            const updatedHospitals = [...registeredHospitals, updatedData];
            localStorage.setItem(
                'registered_hospitals',
                JSON.stringify(updatedHospitals)
            );
            alert('Hospital profile saved to account!');
        }

        setHospitalData(updatedData);

        // Notify same-tab listeners
        window.dispatchEvent(new Event('hospitals-updated'));
    };


    const addDoctor = async () => {
        if (!newDr.name || !newDr.specialty) {
            alert("Doctor name and specialization required");
            return;
        }

        try {
            const uniquePhone = "98765" + Math.floor(10000 + Math.random() * 90000);
            const selectedSpec = specializationList.find(
                s =>
                    s.name === newDr.specialty ||
                    s.specializationName === newDr.specialty
            );

            console.log("Selected Spec:", selectedSpec);
            if (!selectedSpec?.id) {
                alert("Specialization not found in DB");
                return;
            }
            const payload = {
                doctorName: newDr.name,
                doctorEmail: `${newDr.name.toLowerCase().replace(/\s/g, '')}${Date.now()}@gmail.com`,
                password: "123456",
                qualification: "MBBS",
                experience: 2,
                description: `${newDr.specialty} specialist`,
                phoneNo: uniquePhone,
                hospitalId: Number(hospitalData.id),

                // ✅ REQUIRED FIX
                specializationName: selectedSpec.name || selectedSpec.specializationName,

                consultationFee: 500
            };

            await addDoctorApi(payload);

            loadHospitalProfile(hospitalData.id);

            setNewDr({
                name: '',
                specialty: ''
            });

            alert("Doctor added successfully");

        } catch (error) {
            console.error("Doctor Save Error:", error.response?.data || error);
            alert(error.response?.data?.message || "Failed to add doctor");
        }
    };
    const removeDoctor = async (doctorId) => {
        try {
            console.log("Deleting doctor id:", doctorId);

            const response = await deleteDoctorApi(doctorId);

            console.log("Delete API response:", response.data);

            await loadHospitalProfile(hospitalData.id);

            alert("Doctor deleted successfully");

        } catch (error) {
            console.error("Delete Error:", error.response?.data || error);
            alert("Failed to delete doctor");
        }
    };
    const handleSignOut = () => {
        localStorage.removeItem('current_hospital_id');
        localStorage.removeItem('is_website_admin');
        localStorage.removeItem('system_admin_mode');
        localStorage.removeItem('is_patient_logged_in');
        localStorage.removeItem('current_patient_email');
        alert('Hospital signed out successfully.');
        navigate('/');
    };

    useEffect(() => {
        loadSpecializations();
    }, []);
    const loadSpecializations = async () => {
        try {
            const response = await getSpecializationsApi();

            const specs =
                response?.data?.data?.specializations || [];

            setSpecializationList(specs);

            console.log("Specializations API:", specs);

        } catch (error) {
            console.error("Specializations API Error:", error);
            setSpecializationList([]);
        }
    };


    const addSpecialization = async () => {
        if (newSpec.trim()) {
            try {
                const response = await addSpecializationApi({
                    name: newSpec
                });

                console.log("Add Specialization API:", response?.data);

                setHospitalData(prev => ({
                    ...prev,
                    specializations: [...prev.specializations, newSpec]
                }));

                setNewSpec('');

                loadSpecializations();

                alert("Specialization added successfully");

            } catch (error) {
                console.error("Add Specialization API Error:", error);
                alert("Failed to add specialization");
            }
        }
    };


    const removeSpecialization = async (spec) => {
        try {
            const target = specializationList.find(

                s =>
                    s.name === spec ||
                    s.specialization === spec ||
                    s.specializationName === spec
            );

            if (target?.id) {
                await deleteSpecializationApi(target.id);
            }

            setHospitalData(prev => ({
                ...prev,
                specializations: prev.specializations.filter(s => s !== spec)
            }));

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Cannot delete specialization because it is linked to doctors";

            alert(message);
            console.error(error);
        }
    };

    return (
        <div className="registration-page">
            <div className="auth-container" style={{ maxWidth: '1200px' }}>
                {/* ── Sidebar ── */}
                <div className="auth-sidebar" style={{ backgroundColor: '#2563eb' }}>
                    <div className="sidebar-logo">
                        <FaHospital />
                    </div>
                    <h1 className="sidebar-title">Hospital Portal</h1>
                    <p style={{ opacity: 0.9, fontSize: '18px', lineHeight: '1.6' }}>
                        Manage your facility's public presence, update healthcare offerings, and maintain your staff list.
                    </p>
                    <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                        <span style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                        }}>
                            ID: {hospitalData.id}
                        </span>
                    </div>
                </div>

                {/* ── Main Content ── */}
                <div className="auth-content">
                    <div className="auth-header-wrapper" style={{ marginBottom: '30px' }}>
                        <div className="auth-title-section">
                            <h2>{isEditing ? 'Edit Profile' : 'Hospital Overview'}</h2>
                            <p style={{ color: '#64748b' }}>Customize how patients see your facility</p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className="submit-btn"
                                style={{
                                    width: 'auto',
                                    padding: '8px 20px',
                                    background: isEditing ? '#10b981' : '#2563eb',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {isEditing ? <><FaSave /> Save</> : <><FaEdit /> Edit</>}
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="submit-btn"
                                style={{
                                    width: 'auto',
                                    padding: '8px 20px',
                                    background: '#ef4444',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <FaSignOutAlt /> Exit
                            </button>
                        </div>
                    </div>

                    <div className="registration-form">
                        <div className="form-group">
                            <label>Hospital Name *</label>
                            {isEditing ? (
                                <input type="text" name="name" value={hospitalData.name} onChange={handleChange} />
                            ) : (
                                <div className="read-only-value">{hospitalData.name}</div>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label><FaMapMarkerAlt /> Location</label>
                                {isEditing ? (
                                    <input type="text" name="location" value={hospitalData.location} onChange={handleChange} />
                                ) : (
                                    <div className="read-only-value">{hospitalData.location}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label><FaPhone /> Phone</label>
                                {isEditing ? (
                                    <input type="tel" name="phone" value={hospitalData.phone} onChange={handleChange} />
                                ) : (
                                    <div className="read-only-value">{hospitalData.phone}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label><FaEnvelope /> Email</label>
                                {isEditing ? (
                                    <input type="email" name="email" value={hospitalData.email} onChange={handleChange} />
                                ) : (
                                    <div className="read-only-value">{hospitalData.email}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label><FaInfoCircle /> Established</label>
                                {isEditing ? (
                                    <input type="number" name="established" value={hospitalData.established} onChange={handleChange} />
                                ) : (
                                    <div className="read-only-value">{hospitalData.established}</div>
                                )}
                            </div>
                        </div>

                        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            <div className="form-group">
                                <label>Bed Capacity</label>
                                {isEditing ? (
                                    <input type="number" name="beds" value={hospitalData.beds} onChange={handleChange} />
                                ) : (
                                    <div className="read-only-value">{hospitalData.beds}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Staff Count (Approx)</label>
                                {isEditing ? (
                                    <input type="number" name="doctors" value={hospitalData.doctors} onChange={handleChange} />
                                ) : (
                                    <div className="read-only-value">{hospitalData.doctors}</div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            {isEditing ? (
                                <textarea name="about" value={hospitalData.about} onChange={handleChange} rows="4"></textarea>
                            ) : (
                                <div className="read-only-value" style={{ borderBottom: 'none', lineHeight: '1.6' }}>
                                    {hospitalData.about || 'No description provided.'}
                                </div>
                            )}
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />

                        <div className="form-group">
                            <label><FaLock style={{ marginRight: '8px' }} /> Password Settings</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={hospitalData.password || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter new password to reset"
                                    style={{
                                        backgroundColor: !isEditing ? '#f8fafc' : 'white',
                                        paddingRight: '45px',
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0'
                                    }}
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
                                        color: '#94a3b8',
                                        cursor: isEditing ? 'pointer' : 'default',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '5px'
                                    }}
                                    disabled={!isEditing}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {isEditing && <small style={{ color: '#64748b' }}>Change password here to update your facility account security</small>}
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />

                        {/* ── Specializations ── */}
                        <div className="form-group">
                            <label>Departments & Specializations</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                                {hospitalData.specializations.map(spec => (
                                    <div key={spec} className="tag-pill blue">
                                        {spec}
                                        {isEditing && <FaTrash onClick={() => removeSpecialization(spec)} />}
                                    </div>
                                ))}
                            </div>
                            {isEditing && (
                                <div className="inline-add">
                                    <input
                                        type="text" placeholder="e.g. Cardiology"
                                        value={newSpec} onChange={(e) => setNewSpec(e.target.value)}
                                    />
                                    <button onClick={addSpecialization}><FaPlus /> Add</button>
                                </div>
                            )}
                        </div>

                        {/* ── Medical Staff ── */}
                        <div className="form-group">
                            <label><FaUserMd /> Medical Staff (Doctors)</label>
                            <div className="doctors-list-styled">
                                {hospitalData.doctorsList.map((dr, index) => (
                                    <div key={index} className="doctor-item-card">
                                        <div className="dr-icon"><FaUserMd /></div>
                                        <div className="dr-info">
                                            <span className="dr-name">{dr.name}</span>
                                            <span className="dr-spec">{dr.specialty}</span>
                                        </div>
                                        {isEditing && (
                                            <button className="delete-dr" onClick={() => removeDoctor(dr.doctorId)}>
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {isEditing && (
                                <div className="doctor-add-section">
                                    <div className="form-grid" style={{ gap: '10px', marginBottom: '10px' }}>
                                        <input
                                            type="text" placeholder="Doctor Name"
                                            value={newDr.name} onChange={(e) => setNewDr({ ...newDr, name: e.target.value })}
                                        />
                                        <select
                                            value={newDr.specialty}
                                            onChange={(e) => setNewDr({ ...newDr, specialty: e.target.value })}
                                        >
                                            <option value="">Select Specialization</option>
                                            {specializationList.map((spec) => (
                                                <option key={spec.id} value={spec.name || spec.specializationName}>
                                                    {spec.name || spec.specializationName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button onClick={addDoctor} className="submit-btn" style={{ width: '100%', background: '#10b981' }}>
                                        <FaPlus style={{ marginRight: '8px' }} /> Add Doctor to Staff
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .read-only-value {
                    padding: 10px 0;
                    font-size: 15px;
                    color: #1e293b;
                    border-bottom: 1px solid #f1f5f9;
                    min-height: 20px;
                }
                .tag-pill {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 500;
                }
                .tag-pill.blue { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
                .tag-pill svg { cursor: pointer; font-size: 11px; }
                
                .inline-add { display: flex; gap: 8px; }
                .inline-add input { flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; }
                .inline-add button { padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; display: flex; alignItems: center; gap: 5px; }

                .doctors-list-styled {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .doctor-item-card {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                }
                .dr-icon { width: 35px; height: 35px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #64748b; }
                .dr-info { display: flex; flexDirection: column; flex: 1; }
                .dr-name { font-weight: 600; color: #1e293b; font-size: 14px; }
                .dr-spec { font-size: 12px; color: #64748b; }
                .delete-dr { border: none; background: none; color: #ef4444; cursor: pointer; padding: 5px; }

                .doctor-add-section {
                    background: #f1f5f9;
                    padding: 15px;
                    border-radius: 12px;
                }
                .doctor-add-section input {
                    padding: 10px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    width: 100%;
                }
            `}} />
        </div >
    );
}