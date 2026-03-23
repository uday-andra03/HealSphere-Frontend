import { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import {
  getSurgeriesEmergencies,
  getAdmissionsDischarges,
  getSpecializations,
} from "../services/dashboardApi";

const COLORS = [
  "#2a9d8f",
  "#3a86ff",
  "#e76f51",
  "#f4a261",
  "#9b5de5",
  "#43aa8b",
  "#ff9f1c",
  "#577590",
];

export default function DashboardCharts() {
  const [admissionsData, setAdmissionsData] = useState([]);
  const [specializationData, setSpecializationData] = useState([]);
  const [barData, setBarData] = useState([]);

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    loadChartData();
    loadSpecializations();
    loadBarData();
  }, []);

  const extractFirstArray = (dataObject) => {
    if (!dataObject || typeof dataObject !== "object") return [];
    const firstValue = Object.values(dataObject)[0];
    return Array.isArray(firstValue) ? firstValue : [];
  };

const loadChartData = async () => {
  try {
    const response = await getAdmissionsDischarges();

    console.log("Admissions API FULL:", response.data);

    const raw = extractFirstArray(response?.data?.data);
    console.log("Admissions RAW:", raw);
    const formatted = raw.map((item) => ({
      day: item.day ?? item.Day ?? item.date ?? "N/A",
      admissions: item.admissions ?? item.Admissions ?? item.admissionCount ?? 0,
      discharges: item.discharges ?? item.Discharges ?? item.dischargeCount ?? 0,
    }));

    setAdmissionsData(formatted);
  } catch (error) {
    console.error("Admissions Chart API Error:", error);
    setAdmissionsData([]);
  }
};

const loadSpecializations = async () => {
  try {
    const response = await getSpecializations();

    console.log("Specializations API FULL:", response.data);

    const raw = extractFirstArray(response?.data?.data);
    console.log("Specializations RAW:", raw);
    const formatted = raw.map((item) => ({
      name: item.specialization ?? item.name ?? "Unknown",
      value: item.doctorCount ?? item.doctor_count ?? item.value ?? 0,
    }));

    setSpecializationData(formatted);
  } catch (error) {
    console.error("Specialization API Error:", error);
    setSpecializationData([]);
  }
};

const loadBarData = async () => {
  try {
    const response = await getSurgeriesEmergencies();

    console.log("Surgeries API FULL:", response.data);

    const raw = extractFirstArray(response?.data?.data);
    console.log("Surgeries RAW:", raw); 
    const formatted = raw.map((item) => ({
      name: item.day ?? item.Day ?? item.date ?? "N/A",
      surgeries: item.surgeries ?? item.Surgeries ?? 0,
      emergencies: item.emergencies ?? item.Emergencies ?? 0,
    }));

    setBarData(formatted);
  } catch (error) {
    console.error("Bar Chart API Error:", error);
    setBarData([]);
  }
};

  return (
    <div className="dashboard-charts">

      {/* Admissions */}
      <div className="chart-card large">
        <h2>Admissions & Discharges</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={admissionsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />

            <Line dataKey="admissions" stroke="#2a9d8f" strokeWidth={3} />
            <Line dataKey="discharges" stroke="#3a86ff" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Specializations */}
      <div className="chart-card small">
        <h2>Specializations</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={specializationData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
            >
              {specializationData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Surgeries */}
      <div className="chart-card large">
        <h2>Surgeries & Emergencies</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="surgeries" fill="#e76f51" />
            <Bar dataKey="emergencies" fill="#f4a261" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}