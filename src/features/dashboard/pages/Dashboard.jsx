import React, { useState, useMemo, useEffect, useRef } from 'react';
import HospitalOverview from '../components/HospitalOverview';
import DashboardStats from '../components/DashboardStats';
import DashboardCharts, { SurgeriesEmergenciesChart } from '../components/DashboardCharts';
import '../styles/dashboard.css';

import {
    getAdminPatients,
    getAdminHospitals
} from "../../../services/adminApi";

import {
    deletePatient
} from "../../../services/patientApi";
import { getDoctorsByHospitalId } from "../../../services/doctorApi";
import {
    getDashboardSummary,
    getAdmissionsDischarges,
    getSpecializations,
    getSurgeriesEmergencies,
} from '../../../services/dashboardApi';

export default function Dashboard() {
    const [selectedHospitalId, setSelectedHospitalId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const overviewRef = useRef(null);

    const [patients, setPatients] = useState([]);
    const [dashboardSummary, setDashboardSummary] = useState({});
    const [admissionsData, setAdmissionsData] = useState([]);
    const [specializationData, setSpecializationData] = useState([]);
    const [surgeriesData, setSurgeriesData] = useState([]);
    const [backendHospitals, setBackendHospitals] = useState([]);

    useEffect(() => {
        loadDashboardApis();
        loadAdminPatients();
        loadHospitals();
    }, []);

    const loadHospitals = async () => {
        try {
            const response = await getAdminHospitals();

            const hospitals =
                response?.data?.data?.hospitals ||
                response?.data?.data?.["Hospital list"] ||
                [];

            setBackendHospitals(hospitals);
        } catch (error) {
            console.error("Hospitals API Error:", error);
            setBackendHospitals([]);
        }
    };

    useEffect(() => {
        if (backendHospitals.length > 0) {
            calculateActiveDoctors();
        }
    }, [backendHospitals]);

    const calculateActiveDoctors = async () => {
        try {
            let totalActiveDoctors = 0;

            for (let hospital of backendHospitals) {

                const res = await getDoctorsByHospitalId(hospital.id).catch((err) => {
                    if (err.response?.status !== 404) {
                        console.error("Doctor API failed:", hospital.id, err);
                    }
                    return null;
                });

                const doctors =
                    res?.data?.status === "SUCCESS"
                        ? res.data.data
                        : [];

                console.log("Doctors:", doctors);

                totalActiveDoctors += doctors.filter(
                    (doc) => doc.isActive !== "inActive"
                ).length;
            }

            console.log("Final Active Doctors:", totalActiveDoctors);

            setDashboardSummary(prev => ({
                ...prev,
                activeDoctors: totalActiveDoctors
            }));

        } catch (error) {
            console.error("Active Doctors Error:", error);
        }
    };
    const loadDashboardApis = async () => {
        try {
            const summaryRes = await getDashboardSummary();
            setDashboardSummary(summaryRes?.data?.data || {});
        } catch (error) {
            console.error("Summary API Error:", error);
        }

        try {
            const admissionsRes = await getAdmissionsDischarges();

            const rawAdmissions =
                admissionsRes?.data?.data?.["Admissions vs Discharges"] ||
                admissionsRes?.data?.data?.["Admissions and Discharges"] ||
                Object.values(admissionsRes?.data?.data || {})[0] ||
                [];

            const admissions = Array.isArray(rawAdmissions)
                ? rawAdmissions.map((item) => ({
                    date: item.Day || item.day || item.date,
                    admissions: item.Admissions || item.admissions || item.admissionCount || 0,
                    discharges: item.Discharges || item.discharges || item.dischargeCount || 0
                }))
                : [];

            setAdmissionsData(admissions);
        } catch (error) {
            console.error("Admissions API Error:", error);
        }

        try {
            const specializationRes = await getSpecializations();

            const rawSpecs =
                specializationRes?.data?.data?.["Specialization distribution"] || [];

            const specs = Array.isArray(rawSpecs)
                ? rawSpecs.map((item) => ({
                    name: item.specialization,
                    value: item.doctorCount
                }))
                : [];

            setSpecializationData(specs);
        } catch (error) {
            console.error("Specialization API Error:", error);
        }

        try {
            const surgeriesRes = await getSurgeriesEmergencies();

            const surgeriesObject = surgeriesRes?.data?.data || {};
            const rawSurgeries = Object.values(surgeriesObject)[0] || [];

            const surgeries = Array.isArray(rawSurgeries)
                ? rawSurgeries.map((item) => ({
                    date: item.Day || item.day || item.date,
                    surgeries: item.Surgeries || item.surgeries || 0,
                    emergencies: item.Emergencies || item.emergencies || 0
                }))
                : [];

            setSurgeriesData(surgeries);
        } catch (error) {
            console.error("Surgeries API Error:", error);
        }
    };

    const loadAdminPatients = async () => {
        try {
            const response = await getAdminPatients();

            console.log("PATIENT FULL RESPONSE:", response);
            console.log("PATIENT DATA:", response?.data);

            let apiPatients = [];

            if (Array.isArray(response?.data?.data)) {
                apiPatients = response.data.data;
            } else if (Array.isArray(response?.data?.data?.patients)) {
                apiPatients = response.data.data.patients;
            } else if (Array.isArray(response?.data?.data?.["Patient list"])) {
                apiPatients = response.data.data["Patient list"];
            } else if (Array.isArray(response?.data)) {
                apiPatients = response.data;
            }

            console.log("FINAL PATIENTS:", apiPatients);

            setPatients(apiPatients);

        } catch (error) {
            console.error("Patients API Error:", error.response || error);
            setPatients([]);
        }
    };

    const filteredOptions = useMemo(() => {
        return backendHospitals.filter(h =>
            h.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, backendHospitals]);

    const handleViewPatient = async (patient) => {
        try {
            alert(
                `Patient Name: ${patient.name || patient.patientName || "N/A"}
Phone: ${patient.phone || patient.phoneNumber || patient.mobileNumber || "N/A"}
Gender: ${patient.gender || patient.sex || "N/A"}
Hospital: ${patient.hospital?.name || patient.hospitalName || "N/A"}`
            );
        } catch (error) {
            console.error("Patient Details API Error:", error);
        }
    };

    const handleDeletePatient = async (id) => {
        try {
            await deletePatient(id);
            setPatients(prev => prev.filter(p => (p.patientId || p.id) !== id));
            alert("Patient deleted successfully");
        } catch (error) {
            console.error("Delete Patient API Error:", error);
        }
    };

    return (
        <div className="dashboard-page">
            <main className="dashboard-main-content">

                <DashboardStats stats={dashboardSummary} />

                <DashboardCharts
                    areaData={admissionsData}
                    pieData={specializationData}
                />

                <div className="dashboard-chart-full">
                    <SurgeriesEmergenciesChart data={surgeriesData} />
                </div>

                <div className="dashboard-table-section" ref={overviewRef}>
                    <HospitalOverview isSingle={!!selectedHospitalId} />
                </div>

                <div className="dashboard-table-section" style={{ marginTop: '30px' }}>
                    <h2>Patients</h2>

                    <table className="hospital-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Gender</th>
                                <th>Hospital</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {patients.length > 0 ? (
                                patients.map((p, index) => (
                                    <tr key={`${p.patientId || p.id}-${index}`}>
                                        <td>{p.name || p.patientName || "N/A"}</td>
                                        <td>{p.phoneNumber || p.phone || p.mobileNumber || "N/A"}</td>
                                        <td>{p.gender || p.sex || "N/A"}</td>
                                        <td>{p.hospital?.name || p.hospitalName || "-"}</td>

                                        <td style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleViewPatient(p)}>
                                                View
                                            </button>

                                            <button onClick={() => handleDeletePatient(p.patientId || p.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No patients found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
