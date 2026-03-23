import api from "./api";

export const patientRegister = (data) =>
    api.post("/api/patient/register", data);

export const patientLogin = (data) =>
    api.post("/api/patient/login", data);

export const patientLogout = () =>
    api.post("/api/patient/logout");

export const updatePatient = (patientId, data) =>
    api.put(`/api/patient/update/${patientId}`, data);

export const getPatientById = (patientId) =>
  api.get(`/api/admin/patients/${patientId}`);

export const deletePatient = (patientId) =>
    api.delete(`/api/admin/patients/${patientId}`);

// ✅ Add Review
export const addReviewApi = async (patientId, hospitalId, data) => {
  return await api.post(
    `/api/patient/${patientId}/hospitals/${hospitalId}/review`,
    data
  );
};


// ✅ Optional: patient view
export const getPatientDoctorReviewsApi = async (doctorId) => {
  return await api.get(`/api/patient/doctors/${doctorId}/reviews`);
};