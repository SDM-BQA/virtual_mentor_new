// MentorDashboard.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MentorDashboard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MentorDashboard = () => {
  const { userId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState(60);
  const [duplicateError, setDuplicateError] = useState(null);

  useEffect(() => {
    console.log("userId:", userId);
    const fetchMentor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/mentors/${userId}`
        );
        console.log("Mentor response:", response.data); // Debugging
        setMentor(response.data);
      } catch (err) {
        console.error("Error fetching mentor:", err); // Debugging
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMentor();
    } else {
      setLoading(false);
      setError("Mentor ID not available");
    }
  }, [userId]);

  // handle add session - ONLY CONSOLE LOGGING
  const handleAddSession = () => {
    setDuplicateError(null);
    const dateTime = new Date(`${date.toDateString()} ${time}`);
    console.log("Selected dateTime:", dateTime.toISOString());

    const newSession = {
      mentorId: userId,
      date: dateTime.toISOString(),
      duration: duration,
      status: "available",
    };

    console.log("handleAddSession: Prepared session data:", newSession);

    // Reset form fields
    setDate(new Date());
    setTime("10:00");
    setDuration(60);
  };

  const filterPassedDates = (day) => {
    const currentDate = new Date();
    return day >= currentDate.setHours(0, 0, 0, 0);
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error)
    return <div className="error-container">Error: {error.message}</div>;
  if (!mentor)
    return <div className="not-found-container">Mentor not found.</div>;

  return (
    <div className="mentor-dashboard-container">
      <div className="profile-header">
        <img
          src="https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg"
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
            {duplicateError && (
              <p className="duplicate-error">{duplicateError}</p>
            )}
          </div>
          {/* We'll add the display of sessions later */}
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
            <strong>Location:</strong> {mentor.city}, {mentor.state},{" "}
            {mentor.country}
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