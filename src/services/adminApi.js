import api from "./api";

export const getPayments = () =>
  api.get("/api/admin/payments");

export const getDailyRevenue = () =>
  api.get("/api/admin/revenue/daily");

export const getMonthlyRevenue = () =>
  api.get("/api/admin/revenue/monthly");

export const getYearlyRevenue = () =>
  api.get("/api/admin/revenue/yearly");

export const createSubscription = (data) =>
  api.post("/api/admin/subscriptions", data);

export const subscriptionPayment = (data) =>
  api.post("/api/admin/subscriptions/payment", data);

export const getSubscriptions = () =>
  api.get("/api/admin/subscriptions");

export const renewSubscription = (hospitalId, data) =>
  api.put(`/api/admin/subscriptions/${hospitalId}/renew`, data);

export const sendNotification = (data) =>
  api.post("/api/admin/notifications", data);

export const getNotifications = () =>
  api.get("/api/admin/notifications");

export const getAdminHospitals = async () => {
  return await api.get(`/api/admin/hospitals`);
};

export const getAdminPatients = async () => {
  return await api.get(`/api/admin/patients`);
};

export const getAdminUsers = async () => {
  return await api.get("/api/admin/users");
};

export const getAdminUserById = async (id) => {
  return await api.get(`/api/admin/users/${id}`);
};