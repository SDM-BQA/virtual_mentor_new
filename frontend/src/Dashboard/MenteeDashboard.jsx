import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import "./MenteeDashboard.css";
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

  if (loading) return <div className="loading-container">Loading mentee dashboard...</div>;
  if (error) return <div className="error-container">Error: {error?.message || error}</div>;
  if (!menteeData) return <div className="not-found-container">Mentee data not found.</div>;

  return (
    <div className="mentee-dashboard-container">
      <div className="profile-header">
        <img
          src="https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg"
          alt={`${menteeData.fname || "Mentee"} ${menteeData.lname || ""}`}
          className="profile-picture"
        />
        <h2 className="profile-name">
          {menteeData.fname ? `${menteeData.fname} ${menteeData.lname || ""}` : "Name not available"}
        </h2>
        <p className="profile-role">Mentee Dashboard</p>
      </div>

      <div className="profile-details">
        <div className="detail-section">
          <p><strong>Email:</strong> {menteeData.email}</p>
          <p><strong>Mobile:</strong> {menteeData.mobile}</p>
          <p><strong>Gender:</strong> {menteeData.gender}</p>
          <p><strong>Date of Birth:</strong> {menteeData.dob ? new Date(menteeData.dob).toLocaleDateString() : "N/A"}</p>
          <p><strong>Location:</strong> {menteeData.city}, {menteeData.state}, {menteeData.country}</p>
        </div>
       
      </div>

      <div className="mentee-stats mb-4 p-3 border rounded">
        <h3>Your Stats</h3>
        <p>Total Sessions Booked: {menteeData.totalSessionsBooked || 'N/A'}</p>
        <p>Upcoming Sessions: {menteeData.upcomingSessions || 'N/A'}</p>
      </div>

      <div className="mentee-actions">
        <h3>Quick Actions</h3>
        <Link to={"/explore"} className="btn btn-success me-2">Book a Session</Link>
        {/* <button className="btn btn-info">View Session History</button> */}
      </div>
      <div className="profile-actions">
        <button className="back-button" onClick={() => window.history.back()}>
        ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default MenteeDashboard;