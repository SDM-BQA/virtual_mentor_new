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
  const [availableSessions, setAvailableSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState(null);
  const [menteeDetails, setMenteeDetails] = useState({});

  const fetchAvailableSessions = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/mentors/sessions?mentorId=${userId}&status=available`
        );
        const sortedAvailableSessions = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setAvailableSessions(sortedAvailableSessions);
      } catch (err) {
        console.error("Error fetching available sessions:", err);
      }
    }
  };

  const fetchUpcomingSessions = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/mentors/sessions?mentorId=${userId}&status=booked`
        );
        const sortedUpcomingSessions = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setUpcomingSessions(sortedUpcomingSessions);
        const menteeIds = sortedUpcomingSessions
          .map((session) => session.menteeId)
          .filter(Boolean);
        if (menteeIds.length > 0) {
          fetchMenteesDetails(menteeIds);
        }
      } catch (err) {
        console.error("Error fetching upcoming sessions:", err);
        setSessionsError(err);
      } finally {
        setSessionsLoading(false);
      }
    }
  };

  const fetchMenteesDetails = async (menteeIds) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/mentees/details`,
        { menteeIds }
      );
      const details = {};
      response.data.forEach((mentee) => {
        details[mentee._id] = {
          name: `${mentee.fname} ${mentee.lname || ""}`,
          age: calculateAge(mentee.dob),
          id: mentee._id,
        };
      });
      setMenteeDetails(details);
    } catch (error) {
      console.error("Error fetching mentees details:", error);
    }
  };

  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

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

    if (userId) {
      fetchMentor();
      fetchAvailableSessions();
      fetchUpcomingSessions();
    } else {
      setLoading(false);
      setError("Mentor ID not available");
      setSessionsLoading(false);
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

      // Check if a session with the same date and time already exists in upcoming sessions
      const alreadyBooked = upcomingSessions.some(
        (session) =>
          new Date(session.date).getTime() === dateTime.getTime() &&
          session.duration === duration
      );

      if (alreadyBooked) {
        setDuplicateError("This session already exists in your booked sessions.");
        return;
      }

      // Check if a session with the same date and time already exists in available sessions
      const alreadyAvailable = availableSessions.some(
        (session) =>
          new Date(session.date).getTime() === dateTime.getTime() &&
          session.duration === duration
      );

      if (alreadyAvailable) {
        setDuplicateError("This session is already available.");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/mentors/sessions",
        newSession
      );
      setDate(new Date());
      setTime("10:00");
      setDuration(60);
      fetchAvailableSessions();
    } catch (error) {
      setDuplicateError(error?.response?.data?.message || "An error occurred.");
    }
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
      {/* ... profile header ... */}
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
            {/* ... date, time, duration pickers ... */}
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

          <div className="available-sessions-container">
            <h4>Available Sessions</h4>
            {availableSessions.length > 0 ? (
              <div className="available-sessions-grid">
                {availableSessions.map((session) => (
                  <div key={session._id} className="session-card">
                    <h5 className="session-card-date">
                      {new Date(session.date).toLocaleDateString()}
                    </h5>
                    <p className="session-card-time">
                      {new Date(session.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="session-card-duration">
                      Duration: {session.duration} minutes
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-sessions">No available sessions yet.</p>
            )}
          </div>
        </div>

        <div className="upcoming-sessions mt-5">
          <h3>Upcoming Booked Sessions</h3>
          {sessionsLoading ? (
            <div className="loading-container">
              Loading upcoming sessions...
            </div>
          ) : sessionsError ? (
            <div className="error-container">
              Error loading upcoming sessions: {sessionsError?.message || sessionsError}
            </div>
          ) : upcomingSessions.length > 0 ? (
            <div className="accordion" id="upcomingSessionsAccordion">
              {upcomingSessions.map((session, index) => {
                const sessionId = `session-${index}`;
                const mentee = menteeDetails[session.menteeId];

                return (
                  <div className="accordion-item" key={session._id}>
                    <h2
                      className="accordion-header"
                      id={`heading-${sessionId}`}
                    >
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${sessionId}`}
                        aria-expanded="false"
                        aria-controls={`collapse-${sessionId}`}
                      >
                        {new Date(session.date).toLocaleDateString()} at{" "}
                        {new Date(session.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </button>
                    </h2>
                    <div
                      id={`collapse-${sessionId}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading-${sessionId}`}
                      data-bs-parent="#upcomingSessionsAccordion"
                    >
                      <div className="accordion-body">
                        <p>
                          <strong>Duration:</strong> {session.duration} minutes
                        </p>
                        {mentee ? (
                          <p>
                            <strong>Booked by:</strong> {mentee.name} (ID:{" "}
                            {mentee.id}, Age: {mentee.age})
                          </p>
                        ) : session.menteeId ? (
                          <p>
                            <strong>Booked by:</strong> Mentee ID:{" "}
                            {session.menteeId} (Fetching details...)
                          </p>
                        ) : (
                          <p>
                            <strong>Booked by:</strong> Not available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-sessions">No upcoming sessions booked.</p>
          )}
        </div>
      </div>
      {/* ... profile details ... */}
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