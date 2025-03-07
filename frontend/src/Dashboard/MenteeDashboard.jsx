import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const MenteeDashboard = () => {
  const { userId } = useParams();
  const [menteeData, setMenteeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenteeData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/mentees/${userId}`);
        setMenteeData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (userId) {
      fetchMenteeData();
    } else {
      setLoading(false);
      setError("User ID not available");
    }
  }, [userId]);

  if (loading) return <div className="text-center mt-5">Loading mentee dashboard...</div>;
  if (error) return <div className="text-danger text-center mt-5">Error: {error?.message || error}</div>;
  if (!menteeData) return <div className="text-center mt-5">Mentee data not found.</div>;

  return (
    <div className="mentee-dashboard p-4">
      <h2 className="mb-4">Mentee Dashboard</h2>
      <div className="dashboard-content">
        <p className="mb-3">Welcome, {menteeData.fname} {menteeData.lname}!</p>
        <div className="mentee-stats mb-4 p-3 border rounded">
          <h3>Your Stats</h3>
          <p>Total Sessions Booked: {menteeData.totalSessionsBooked || 'N/A'}</p>
          <p>Upcoming Sessions: {menteeData.upcomingSessions || 'N/A'}</p>
        </div>
        <div className="mentee-actions">
          <h3>Quick Actions</h3>
          <Link to={"/explore"} className="btn btn-success me-2">Book a Session</Link>
          <button className="btn btn-info">View Session History</button>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard;