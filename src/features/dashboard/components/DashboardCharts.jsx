import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

import {
    getAdmissionsDischarges,
    getSpecializations,
    getSurgeriesEmergencies
} from '../../../services/dashboardApi';

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

export default function DashboardCharts({ areaData, pieData }) {
    const [apiAreaData, setApiAreaData] = useState([]);
    const [apiPieData, setApiPieData] = useState([]);

    useEffect(() => {
        if (areaData?.length > 0) {
            setApiAreaData(areaData);
        }

        if (pieData?.length > 0) {
            setApiPieData(pieData);
        }

        if (!areaData?.length || !pieData?.length) {
            loadChartData();
        }
    }, [areaData, pieData]);


    const loadChartData = async () => {
        try {
            const admissions = await getAdmissionsDischarges();
            const specializations = await getSpecializations();

            const rawAdmissions =
                Object.values(admissions?.data?.data || {})[0] || [];

            const formattedAdmissions = Array.isArray(rawAdmissions)
                ? rawAdmissions.map((item) => ({
                    date: item.Day || item.day || item.date,
                    admissions:
                        item.Admissions ||
                        item.admissions ||
                        item.admissionCount ||
                        0,
                    discharges:
                        item.Discharges ||
                        item.discharges ||
                        item.dischargeCount ||
                        0
                }))
                : [];

            const rawSpecs =
                specializations?.data?.data?.["Specialization distribution"] || [];

            const formattedSpecs = Array.isArray(rawSpecs)
                ? rawSpecs.map((item) => ({
                    name: item.specialization,
                    value: item.doctorCount
                }))
                : [];

            setApiAreaData(formattedAdmissions);
            setApiPieData(formattedSpecs);

        } catch (error) {
            console.error("Chart API Error:", error);
        }
    };


    return (
        <div className="dashboard-charts" style={{ width: '100%', minHeight: '350px' }}>
            <div className="chart-card large" style={{ minHeight: '350px' }}>
                <h2>Admissions & Discharges (14 Days)</h2>

                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={apiAreaData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />

                            <Line type="monotone" dataKey="admissions" stroke="#2a9d8f" strokeWidth={3} />
                            <Line type="monotone" dataKey="discharges" stroke="#3a86ff" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="chart-card small" style={{ minHeight: '350px' }}>
                <h2>Specializations</h2>

                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={apiPieData}
                                dataKey="value"
                                cx="40%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={4}
                            >
                                {apiPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend layout="vertical" verticalAlign="middle" align="right" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export function SurgeriesEmergenciesChart({ data }) {
    const [barData, setBarData] = useState([]);

    useEffect(() => {
        if (data?.length > 0) {
            setBarData(data);
        } else {
            loadBarData();
        }
    }, [data]);

    const loadBarData = async () => {
        try {
            const surgeries = await getSurgeriesEmergencies();

            const rawSurgeries =
                Object.values(surgeries?.data?.data || {})[0] || [];

            const formatted = Array.isArray(rawSurgeries)
                ? rawSurgeries.map((item) => ({
                    date: item.Day || item.day || item.date,
                    surgeries:
                        item.Surgeries ||
                        item.surgeries ||
                        0,
                    emergencies:
                        item.Emergencies ||
                        item.emergencies ||
                        0
                }))
                : [];

            setBarData(formatted);

        } catch (error) {
            console.error("Bar Chart API Error:", error);
        }
    };



    return (
        <div className="chart-card bar-chart-box full-width" style={{ minHeight: '400px' }}>
            <h2>Surgeries & Emergencies</h2>

            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        <Bar dataKey="surgeries" fill="#ff7043" />
                        <Bar dataKey="emergencies" fill="#ffb74d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}