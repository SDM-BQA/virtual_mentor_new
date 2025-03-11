import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookSession.css';
import { AuthContext } from '../context/AuthContext';

const BookSession = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [availableSessions, setAvailableSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/mentors/${mentorId}`);
        setMentor(response.data);
  
        const sessionsResponse = await axios.get(`http://localhost:5000/api/mentors/sessions?mentorId=${mentorId}&status=available`); // Corrected URL
        setAvailableSessions(sessionsResponse.data);
        console.log(sessionsResponse.data);
  
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
  
    fetchMentor();
  }, [mentorId]);

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">Error: {error.message}</div>;
  if (!mentor) return <div className="not-found-container">Mentor not found.</div>;

  const handleBooking = async () => {
    if (!selectedSession) {
      alert("Please select a session.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/mentors/sessions/${selectedSession._id}`, {
        menteeId: userId,
        status: "booked",
      });

      alert(`Booking session with ${mentor.firstName} ${mentor.lastName} on ${selectedSession.date}`);
      navigate(`/mentee-dashboard/${userId}`);
    } catch (bookingError) {
      alert("Error booking session. Please try again.");
      console.error("Booking error:", bookingError);
    }
  };

  return (
    <div className="book-session-container">
      <h2 className="text-center mb-4">Book a Session with {mentor.firstName} {mentor.lastName}</h2>

      <div className="mentor-details">
        <img
          src="https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg"
          alt={`${mentor.firstName} ${mentor.lastName}`}
          className="mentor-image"
        />
        <p><strong>Mentor In:</strong> {mentor.mentorIn}</p>
        <p><strong>Experience:</strong> {mentor.experience} years</p>
        <p><strong>City:</strong> {mentor.city}</p>
        <p><strong>Country:</strong> {mentor.country}</p>
      </div>

      <div className="available-sessions">
        <h3>Available Sessions:</h3>
        {availableSessions.length > 0 ? (
          <ul className="list-group">
            {availableSessions.map((session) => (
              <li
                key={session._id}
                className={`list-group-item ${selectedSession && selectedSession._id === session._id ? 'active' : ''}`}
                onClick={() => setSelectedSession(session)}
              >
                {session.date} - {session.duration} minutes
              </li>
            ))}
          </ul>
        ) : (
          <p>No available sessions found.</p>
        )}
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
        <button className="btn btn-primary" onClick={handleBooking}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookSession;