import React, { useEffect, useState, useRef } from 'react';
import { FaHeartbeat } from 'react-icons/fa';
import '../styles/dashboard.css';

import {
    getAdminHospitals,
    approveHospital,
    deleteHospital
} from '../../../services/hospitalApi';

export default function HospitalOverview({ isSingle }) {
    const [apiData, setApiData] = useState([]);
    const hasLoaded = useRef(false);

    useEffect(() => {
        if (!hasLoaded.current) {
            loadHospitals();
            hasLoaded.current = true;
        }
    }, []);

    const loadHospitals = async () => {
        try {
            const response = await getAdminHospitals();

            const hospitals =
                response?.data?.data?.hospitals ||
                response?.data?.data?.["Hospital list"] ||
                [];

            setApiData(hospitals);

        } catch (error) {
            console.error("Admin Hospitals API Error:", error);
            setApiData([]);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveHospital(id);
            loadHospitals();
        } catch (error) {
            console.error("Approve Hospital Error:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteHospital(id);
            loadHospitals();
        } catch (error) {
            console.error("Delete Hospital Error:", error);
        }
    };

    return (
        <div className="hospital-overview-card">
            <h2 className="hospital-overview-title">
                {isSingle ? "Hospital Details" : "Hospital Overview"}
            </h2>

            <div className="hospital-table-wrapper">
                <table className="hospital-table">
                    <thead>
                        <tr>
                            <th>Hospital</th>
                            <th>Location</th>
                            <th>Beds</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {apiData.map((h, i) => (
                            <tr key={`${h.id || i}-${i}`}>
                                <td className="hospital-name">{h.name}</td>

                                <td className="hospital-location">
                                    {h.location || h.city}
                                </td>

                                <td>{h.beds || h.totalBeds || 0}</td>

                                <td>
                                    <span className="status excellent">
                                        ACTIVE
                                    </span>
                                </td>

                                <td style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleApprove(h.id)}
                                        className="approve-btn"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => handleDelete(h.id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}