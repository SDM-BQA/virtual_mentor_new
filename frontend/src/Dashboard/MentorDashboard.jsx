import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
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
  const navigate = useNavigate(); // Initialize useNavigate

  console.log("useParams():", useParams());
  console.log("user:", user);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        console.log("Fetching mentor with ID:", userId);
        const response = await axios.get(
          `http://localhost:5000/api/mentors/${userId}`
        );
        console.log("API response:", response.data);

        setMentor(response.data);
        setLoading(false);
        setAvailableSessions(response.data.availableSessions || []);
        setUpcomingSessions(response.data.upcomingSessions || []);
        console.log("Mentor state after setMentor:", response.data);
      } catch (err) {
        console.error("Error fetching mentor:", err);
        setError(err);
        setLoading(false);
      }
    };

    if (userId) {
      fetchMentor();
    } else {
      console.error("MentorDashboard: userId is not available");
    }
  }, [userId]);

  const handleAddSession = () => {
    const newSession = `${date.toDateString()} ${time}`;
    setAvailableSessions([...availableSessions, newSession]);
    setUpcomingSessions([...upcomingSessions, newSession]);
    setDate(new Date());
    setTime("10:00");
  };

  if (loading)
    return <div className="loading-container">Loading mentor dashboard...</div>;
  if (error)
    return <div className="error-container">Error: {error.message}</div>;
  if (!mentor)
    return <div className="not-found-container">Mentor not found.</div>;

  return (
    <div className="mentor-dashboard-container">
      <div className="profile-header">
        <img
          src={
            "https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg"
          }
          alt={`${mentor.firstName || "Mentor"} ${mentor.lastName || ""}`}
          className="profile-picture"
        />
        <h2 className="profile-name">
          {mentor.firstName
            ? `${mentor.firstName} ${mentor.lastName || ""}`
            : "Name not available"}
        </h2>
        <p className="profile-role">Mentor Dashboard</p>
      </div>
      <div className="session-management-container">
        <div className="upcoming-sessions">
          <h3>Upcoming Sessions</h3>
          <p className="no-sessions">No upcoming sessions.</p>
        </div>
        <div className="manage-sessions">
          <h3>Manage Sessions</h3>
          <div className="session-scheduler">
            <div className="date-picker">
              <label>Date:</label>
              <DatePicker selected={date} onChange={(date) => setDate(date)} />
            </div>
            <div className="time-picker">
              <label>Time:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <button onClick={handleAddSession}>Add Session</button>
          </div>
          <h4>Available Sessions:</h4>
          {availableSessions.length > 0 ? (
            <ul className="session-list">
              {availableSessions.map((session, index) => (
                <li key={index}>{session}</li>
              ))}
            </ul>
          ) : (
            <p className="no-sessions">No available sessions.</p>
          )}
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-section">
          <p>
            <strong>Mentor In:</strong> {mentor.mentorIn}
          </p>
          <p>
            <strong>Experience:</strong> {mentor.experience} years
          </p>
          <p>
            <strong>Email:</strong> {mentor.email}
          </p>
          <p>
            <strong>Mobile:</strong> {mentor.mobile}
          </p>
          <p>
            <strong>Gender:</strong> {mentor.gender}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {mentor.dob ? new Date(mentor.dob).toLocaleDateString() : "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {mentor.city}, {mentor.state}, {mentor.country}
          </p>
        </div>
        <div className="detail-section">
          <p>
            <strong>Awards:</strong> {mentor.awards || "N/A"}
          </p>
          <p>
            <strong>Instagram:</strong> {mentor.instagram || "N/A"}
          </p>
          <p>
            <strong>LinkedIn:</strong> {mentor.linkedin || "N/A"}
          </p>
          <p>
            <strong>Twitter:</strong> {mentor.twitter || "N/A"}
          </p>
          <p>
            <strong>Facebook:</strong> {mentor.facebook || "N/A"}
          </p>
          <p>
            <strong>Video Link:</strong> {mentor.videoLink || "N/A"}
          </p>
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