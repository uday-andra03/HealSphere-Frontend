import api from "./api";

// Add Doctor
export const addDoctor = async (data) => {
  return await api.post("/api/doctors/addDoctor", data);
};

// Get Doctor By ID
export const getDoctorById = async (doctorId) => {
  return await api.get(`/api/doctors/${doctorId}`);
};

// Update Doctor
export const updateDoctor = async (doctorId, data) => {
  return await api.patch(`/api/doctors/${doctorId}`, data);
};

// Delete Doctor
export const deleteDoctor = async (doctorId) => {
  return await api.delete(`/api/doctors/deleteDoctorDetails?doctorId=${doctorId}`);
} 

// Filter Doctors
export const filterDoctors = async (specialization) => {
  return await api.get(`/api/doctors/filter?specialization=${specialization}`);
};

// Search Doctors
export const searchDoctors = async (name) => {
  return await api.get(`/api/doctors/search?name=${name}`);
};

// Get Doctors By Specialization
export const getDoctorsBySpecialization = async (specialization) => {
  return await api.get(`/api/doctors/specializations?specialization=${specialization}`);
};

// Add Doctor Availability
export const addDoctorAvailability = async (data) => {
  return await api.post("/api/doctors/availability", data);
};

// Get Doctor Availability
export const getDoctorAvailability = async (doctorId) => {
  return await api.get(`/api/doctors/${doctorId}/availability`);
};



// Get Doctors By Hospitals
export const getDoctorsByHospitalId = async (hospitalId) => {
  return await api.get(`/api/doctors/hospitals/${hospitalId}/doctors`);
};


// ✅ Get Reviews by Doctor
export const getDoctorReviewsApi = async (doctorId) => {
  return await api.get(`/api/doctors/${doctorId}/reviews`);
};
