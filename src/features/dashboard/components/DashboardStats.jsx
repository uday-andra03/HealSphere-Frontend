import React from 'react';
import { FaBed, FaUserMd, FaUsers, FaChartLine } from 'react-icons/fa';

export default function DashboardStats({ stats }) {
    const safeStats = {
        beds: stats?.beds || stats?.totalBeds || 0,
        doctors: stats?.activeDoctors ?? stats?.doctors ?? 0,
        patients: stats?.patients || stats?.patientsServed || 0,
        rating: stats?.rating || stats?.averageRating || 0
    };

    const cards = [
        {
            label: 'Total Beds',
            value: safeStats.beds,
            icon: <FaBed />,
            color: 'green'
        },
        {
            label: 'Active Doctors',
            value: safeStats.doctors,
            icon: <FaUserMd />,
            color: 'blue'
        },
        {
            label: 'Patients Served',
            value: safeStats.patients,
            icon: <FaUsers />,
            color: 'teal'
        },
        {
            label: 'Avg Rating',
            value: Number(safeStats.rating || 0).toFixed(2),
            icon: <FaChartLine />,
            color: 'gray'
        }
    ];

    return (
        <div className="dashboard-stats-grid">
            {cards.map((card, idx) => (
                <div key={idx} className="stat-card">
                    <div className="stat-header">
                        <div className={`stat-icon ${card.color}`}>
                            {card.icon}
                        </div>
                    </div>

                    <div className="stat-body">
                        <h2 className="stat-value">{card.value}</h2>
                        <p className="stat-label">{card.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}