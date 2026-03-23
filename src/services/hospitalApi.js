import api from "./api";

/* ================= AUTH ================= */

export const hospitalRegister = async (data) => {
  return await api.post("/api/hospital/register", data);
};

export const hospitalLogin = async (data) => {
  return await api.post("/api/hospital/login", data);
};

/* ================= HOSPITAL ================= */

export const getAllHospitals = async () => {
  return await api.get("/api/hospital");
};

export const getHospitalById = async (id) => {
  return await api.get(`/api/hospital/${id}`);
};

export const searchHospitals = async (name) => {
  return await api.get(`/api/hospital/search?name=${name}`);
};

export const filterHospitals = async (specialization) => {
  return await api.get(`/api/hospital/filter?specialization=${specialization}`);
};

export const sortHospitals = async (sortBy) => {
  return await api.get(`/api/hospital/sort?sortBy=${sortBy}`);
};

export const getHospitalList = async () => {
  return await api.get("/api/hospital/list");
};

/* ================= HOSPITAL DETAILS ================= */

export const getHospitalStats = async (id) => {
  return await api.get(`/api/hospital/${id}/stats`);
};

export const getWeeklyActivity = async (id) => {
  return await api.get(`/api/hospital/${id}/weekly-activity`);
};

export const getHospitalWeeklyActivity = async (hospitalId) => {
  return await api.get(`/api/hospital/${hospitalId}/weekly-activity`);
};

export const getHospitalReviews = async (hospitalId) => {
  return await api.get(`/api/hospital/${hospitalId}/reviews`);
};

export const addMedicine = async (medicineData) => {
  return await api.post("/api/hospital/medicine/add", medicineData);
};

/* ================= ADMIN HOSPITAL ================= */

export const getAdminHospitals = async () => {
  return await api.get("/api/admin/hospitals");
};

export const getAdminHospitalById = async (id) => {
  return await api.get(`/api/admin/hospitals/${id}`);
};

export const approveHospital = async (id) => {
  return await api.put(`/api/admin/hospitals/${id}/approve`);
};

export const deleteHospital = async (id) => {
  return await api.delete(`/api/admin/hospitals/${id}`);
};

/* ================= ADMIN PATIENT ================= */

export const getAdminPatients = async () => {
  return await api.get("/api/admin/patients");
};

export const getPatientById = async (id) => {
  return await api.get(`/api/admin/patients/${id}`);
};

export const deletePatient = async (id) => {
  return await api.delete(`/api/admin/patients/${id}`);
};

/* ================= DOCTOR ================= */

export const approveDoctor = async (id) => {
  return await api.put(`/api/admin/doctors/${id}/approve`);
};

export const rejectDoctor = async (id) => {
  return await api.put(`/api/admin/doctors/${id}/reject`);
};

export const deleteDoctor = async (id) => {
  return await api.delete(`/api/admin/doctors/${id}`);
};

/* ================= SPECIALIZATION ================= */

export const addSpecializationApi = async (data) => {
  return await api.post("/api/admin/specialization", data);
};

export const getSpecializationsApi = async () => {
  return await api.get("/api/admin/specializations");
};

export const deleteSpecializationApi = async (id) => {
  return await api.delete(`/api/admin/specialization/${id}`);
};

/* ================= CREDENTIALS ================= */

export const getHospitalCredentials = async (id) => {
  return await api.get(`/api/admin/hospitals/${id}/credentials`);
};

export const resetHospitalPassword = async (id, newPassword) => {
  return await api.put(
    `/api/admin/hospitals/${id}/reset-password?newPassword=${newPassword}`
  );
};

export const addDoctorApi = async (data) => {
  return await api.post("/api/doctors/addDoctor", data);
};

export const deleteDoctorApi = async (id) => {
  return await api.delete(`/api/admin/doctors/${id}`);
};

