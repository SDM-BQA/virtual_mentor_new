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
        setLoading(false);
        setAvailableSessions([
          "Monday 10:00 AM - 11:00 AM",
          "Wednesday 2:00 PM - 3:00 PM",
          "Friday 4:00 PM - 5:00 PM",
          "Saturday 11:00 AM - 12:00 PM"
        ]);
      } catch (err) {
        setError(err);
        setLoading(false);
        setAvailableSessions([
          "Monday 10:00 AM - 11:00 AM",
          "Wednesday 2:00 PM - 3:00 PM",
          "Friday 4:00 PM - 5:00 PM",
          "Saturday 11:00 AM - 12:00 PM"
        ]);
      }
    };

    fetchMentor();
  }, [mentorId]);

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">Error: {error.message}</div>;
  if (!mentor) return <div className="not-found-container">Mentor not found.</div>;

  const handleBooking = () => {
    if (!selectedSession) {
      alert("Please select a session.");
      return;
    }
    alert(`Booking session with ${mentor.firstName} ${mentor.lastName} on ${selectedSession}`);
    navigate(`/mentee-dashboard/${userId}`);
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
            {availableSessions.map((session, index) => (
              <li
                key={index}
                className={`list-group-item ${selectedSession === session ? 'active' : ''}`}
                onClick={() => setSelectedSession(session)}
              >
                {session}
              </li>
            ))}
          </ul>
        ) : (
          <p>No available sessions.</p>
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
