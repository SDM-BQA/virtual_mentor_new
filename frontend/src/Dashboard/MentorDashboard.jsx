import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const MentorDashboard = () => {
  const { userId } = useParams();
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/mentors/${userId}`);
        setMentorData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [userId]);

  if (loading) return <div className="text-center mt-5">Loading mentor dashboard...</div>;
  if (error) return <div className="text-danger text-center mt-5">Error: {error.message}</div>;
  if (!mentorData) return <div className="text-center mt-5">Mentor data not found.</div>;

  return (
    <div className="mentor-dashboard p-4">
      <h2 className="mb-4">Mentor Dashboard</h2>
      <div className="dashboard-content">
        <p className="mb-3">Welcome, {mentorData.firstName} {mentorData.lastName}!</p>
        <div className="mentor-stats mb-4 p-3 border rounded">
          <h3>Your Stats</h3>
          <p>Total Sessions: {mentorData.totalSessions || 'N/A'}</p>
          <p>Upcoming Sessions: {mentorData.upcomingSessions || 'N/A'}</p>
          <p>Mentor In: {mentorData.mentorIn}</p>
        </div>
        <div className="mentor-actions">
          <h3>Quick Actions</h3>
          <button className="btn btn-primary me-2">View Upcoming Sessions</button>
          <button className="btn btn-secondary">Manage Sessions</button>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;