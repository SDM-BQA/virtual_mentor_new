import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./MenteeDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";

const MenteeDashboard = () => {
  const { userId } = useParams();
  const [menteeData, setMenteeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedSessions, setBookedSessions] = useState([]);
  const [bookedSessionsLoading, setBookedSessionsLoading] = useState(true);
  const [bookedSessionsError, setBookedSessionsError] = useState(null);

  useEffect(() => {
    const fetchMenteeData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/mentees/${userId}`
        );
        setMenteeData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    const fetchBookedSessions = async () => {
      setBookedSessionsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/mentees/booked-sessions/${userId}`
        );
        // Sort sessions by date in ascending order
        const sortedSessions = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setBookedSessions(sortedSessions);
        setBookedSessionsLoading(false);
      } catch (err) {
        setBookedSessionsError(err);
        setBookedSessionsLoading(false);
      }
    };

    if (userId) {
      fetchMenteeData();
      fetchBookedSessions();
    } else {
      setLoading(false);
      setError("User ID not available");
      setBookedSessionsLoading(false);
    }
  }, [userId]);

  const upcomingSessionsCount = bookedSessions.filter(
    (session) => new Date(session.date) > new Date()
  ).length;
  const totalSessionsBookedCount = bookedSessions.length;

  if (loading)
    return <div className="loading-container">Loading mentee dashboard...</div>;
  if (error)
    return (
      <div className="error-container">Error: {error?.message || error}</div>
    );
  if (!menteeData)
    return <div className="not-found-container">Mentee data not found.</div>;

  return (
    <div className="mentee-dashboard-container">
      <div className="profile-header">
        <img
          src="https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg"
          alt={`${menteeData.fname || "Mentee"} ${menteeData.lname || ""}`}
          className="profile-picture"
        />
        <h2 className="profile-name">
          {menteeData.fname
            ? `${menteeData.fname} ${menteeData.lname || ""}`
            : "Name not available"}
        </h2>
        <p className="profile-role">Mentee Dashboard</p>
      </div>

      <div className="profile-details">
        <div className="detail-section">
          <p>
            <strong>Email:</strong> {menteeData.email}
          </p>
          <p>
            <strong>Mobile:</strong> {menteeData.mobile}
          </p>
          <p>
            <strong>Gender:</strong> {menteeData.gender}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {menteeData.dob
              ? new Date(menteeData.dob).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {menteeData.city}, {menteeData.state},{" "}
            {menteeData.country}
          </p>
        </div>
      </div>

      <div className="mentee-stats mb-4 p-3 border rounded">
        <h3>Your Stats</h3>
        <p>Total Sessions Booked: {totalSessionsBookedCount}</p>
        <p>Upcoming Sessions: {upcomingSessionsCount}</p>
      </div>

      <div className="mentee-actions">
        <h3>Quick Actions</h3>
        <Link to={"/explore"} className="btn btn-success me-2">
          Book a Session
        </Link>
        {/* <button className="btn btn-info">View Session History</button> */}
      </div>

      <div className="container mt-5">
        <h3 className="text-center mb-4">Your Booked Sessions</h3>

        {bookedSessionsLoading ? (
          <div className="alert alert-info">Loading booked sessions...</div>
        ) : bookedSessionsError ? (
          <div className="alert alert-danger">
            Error loading sessions:{" "}
            {bookedSessionsError?.message || bookedSessionsError}
          </div>
        ) : bookedSessions.length > 0 ? (
          <div className="accordion" id="bookedSessionsAccordion">
            {bookedSessions.map((session, index) => {
              const sessionId = `session-${index}`;
              return (
                <div className="accordion-item" key={session._id}>
                  <h2 className="accordion-header" id={`heading-${sessionId}`}>
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse-${sessionId}`}
                      aria-expanded="false"
                      aria-controls={`collapse-${sessionId}`}
                    >
                      {session.mentorId
                        ? `${session.mentorId.firstName} ${session.mentorId.lastName}`
                        : "Mentor Name Unavailable"}{" "}
                      – {new Date(session.date).toLocaleDateString()}
                    </button>
                  </h2>
                  <div
                    id={`collapse-${sessionId}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading-${sessionId}`}
                    data-bs-parent="#bookedSessionsAccordion"
                  >
                    <div className="accordion-body">
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Time:</strong>{" "}
                        {new Date(session.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p>
                        <strong>Duration:</strong> {session.duration} minutes
                      </p>
                      {session.mentorId && session.mentorId.mentorIn && (
                        <p>
                          <strong>Subject:</strong> {session.mentorId.mentorIn}
                        </p>
                      )}
                      {/* Optional future button */}
                      <button
                        className="btn btn-outline-primary btn-sm"
                        disabled
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="alert alert-warning">
            You haven’t booked any sessions yet.
          </div>
        )}
      </div>

      <div className="profile-actions">
        <button
          className="back-button"
          onClick={() => window.history.back()}
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default MenteeDashboard;