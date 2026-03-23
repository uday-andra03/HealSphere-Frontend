import api from "./api";

// Dashboard Summary
export const getDashboardSummary = async () => {
  return await api.get("/api/dashboard/summary");
};

// Admissions & Discharges
export const getAdmissionsDischarges = async () => {
  return await api.get("/api/dashboard/admissions-discharges");
};

// Specializations Distribution
export const getSpecializations = async () => {
  return await api.get("/api/dashboard/specializations");
};

// Surgeries & Emergencies
export const getSurgeriesEmergencies = async () => {
  return await api.get("/api/dashboard/surgeries-emergencies");
};

// Hospital Overview
export const getHospitalOverview = async () => {
  return await api.get("/api/dashboard/hospital-overview");
};
//
import axios from "axios";

const BASE_URL = "http://localhost:9092/api";

export const getAllPatients = async () => {
  return await axios.get(`${BASE_URL}/admin/patients`);
};