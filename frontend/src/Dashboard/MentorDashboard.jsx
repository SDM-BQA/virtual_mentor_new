// MentorDashboard.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MentorDashboard.css";
import { AuthContext } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MentorDashboard = () => {
  const { userId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState(60);
  const navigate = useNavigate();
  const [duplicateError, setDuplicateError] = useState(null);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/mentors/${userId}`
        );
        setMentor(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/mentors/${userId}/sessions`
        );
        setAvailableSessions(response.data.filter((session) => session.status === "available"));
        setUpcomingSessions(response.data.filter((session) => session.status === "booked"));
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };

    if (userId) {
      fetchMentor();
      fetchSessions();
    } else {
      setLoading(false);
      setError("Mentor ID not available");
    }
  }, [userId]);

  const handleAddSession = async () => {
    setDuplicateError(null);
    try {
      const dateTime = new Date(`${date.toDateString()} ${time}`);
      const newSession = {
        mentorId: userId,
        date: dateTime.toISOString(),
        duration: duration,
        status: "available",
      };

      const isDuplicate = availableSessions.some(
        (session) =>
          session.mentorId === newSession.mentorId &&
          session.date === newSession.date &&
          session.duration === newSession.duration
      );

      if (isDuplicate) {
        setDuplicateError("This session already exists.");
        return;
      }

      await axios.post("http://localhost:5000/api/mentors/sessions", newSession);

      const response = await axios.get(
        `http://localhost:5000/api/mentors/${userId}/sessions`
      );
      setAvailableSessions(response.data.filter((session) => session.status === "available"));
      setUpcomingSessions(response.data.filter((session) => session.status === "booked"));

      setDate(new Date());
      setTime("10:00");
      setDuration(60);
    } catch (error) {
      console.error("Error adding session:", error);
    }
  };

  const filterPassedDates = (day) => {
    const currentDate = new Date();
    return day >= currentDate.setHours(0, 0, 0, 0);
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">Error: {error.message}</div>;
  if (!mentor) return <div className="not-found-container">Mentor not found.</div>;

  return (
    <div className="mentor-dashboard-container">
      <div className="profile-header">
        <img
          src="https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg"
          alt={`${mentor.firstName || "Mentor"} ${mentor.lastName || ""}`}
          className="profile-picture"
        />
        <h2 className="profile-name">
          {mentor.firstName ? `${mentor.firstName} ${mentor.lastName || ""}` : "Name not available"}
        </h2>
        <p className="profile-role">Mentor Dashboard</p>
      </div>
      <div className="session-management-container">
        <div className="upcoming-sessions">
          <h3>Upcoming Sessions</h3>
          {upcomingSessions.length > 0 ? (
            <ul className="session-list">
              {upcomingSessions.map((session) => (
                <li key={session._id}>
                  {new Date(session.date).toLocaleString()} - {session.duration} minutes
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-sessions">No upcoming sessions.</p>
          )}
        </div>
        <div className="manage-sessions">
          <h3>Manage Sessions</h3>
          <div className="session-scheduler">
            <div className="date-picker">
              <label>Date:</label>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                filterDate={filterPassedDates}
              />
            </div>
            <div className="time-picker">
              <label>Time:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="duration-picker">
              <label>Duration (minutes):</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>
            <button onClick={handleAddSession}>Add Session</button>
            {duplicateError && <p className="duplicate-error">{duplicateError}</p>}
          </div>
          <h4>Available Sessions:</h4>
          {availableSessions.length > 0 ? (
            <ul className="session-list">
              {availableSessions.map((session) => (
                <li key={session._id}>
                  {new Date(session.date).toLocaleString()} - {session.duration} minutes
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-sessions">No available sessions.</p>
          )}
        </div>
      </div>
      <div className="profile-details">
        <div className="detail-section">
          <p><strong>Mentor In:</strong> {mentor.mentorIn}</p>
          <p><strong>Experience:</strong> {mentor.experience} years</p>
          <p><strong>Email:</strong> {mentor.email}</p>
          <p><strong>Mobile:</strong> {mentor.mobile}</p>
          <p><strong>Gender:</strong> {mentor.gender}</p>
          <p><strong>Date of Birth:</strong> {mentor.dob ? new Date(mentor.dob).toLocaleDateString() : "N/A"}</p>
          <p><strong>Location:</strong> {mentor.city}, {mentor.state}, {mentor.country}</p>
        </div>
        <div className="detail-section">
          <p><strong>Awards:</strong> {mentor.awards || "N/A"}</p>
          <p><strong>Instagram:</strong> {mentor.instagram || "N/A"}</p>
          <p><strong>LinkedIn:</strong> {mentor.linkedin || "N/A"}</p>
          <p><strong>Twitter:</strong> {mentor.twitter || "N/A"}</p>
          <p><strong>Facebook:</strong> {mentor.facebook || "N/A"}</p>
          <p><strong>Video Link:</strong> {mentor.videoLink || "N/A"}</p>
        </div>
        <div className="bio-section">
          <strong>Bio:</strong> {mentor.bio || "N/A"}
        </div>
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
    </div>
  );
};

export default MentorDashboard;