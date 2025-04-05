import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookSession.css';
import { AuthContext } from '../context/AuthContext';
import ConfirmationPopup from '../components/ConfirmationPopup'; // Import the popup component

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
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [bookingErrorPopup, setBookingErrorPopup] = useState(false);
  const [bookingErrorMessage, setBookingErrorMessage] = useState('');

  useEffect(() => {
    const fetchMentorAndSessions = async () => {
      try {
        const mentorResponse = await axios.get(`http://localhost:5000/api/mentors/${mentorId}`);
        setMentor(mentorResponse.data);

        const sessionsResponse = await axios.get(`http://localhost:5000/api/mentors/sessions?mentorId=${mentorId}&status=available`);
        setAvailableSessions(sessionsResponse.data);
        console.log("Available Sessions:", sessionsResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchMentorAndSessions();
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

      const sessionDate = new Date(selectedSession.date).toLocaleDateString();
      const sessionTime = new Date(selectedSession.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setConfirmationMessage(`Session booked successfully with ${mentor.firstName} ${mentor.lastName} on ${sessionDate} at ${sessionTime}`);
      setShowConfirmationPopup(true);
    } catch (bookingError) {
      setBookingErrorMessage("Error booking session. Please try again.");
      setBookingErrorPopup(true);
      console.error("Booking error:", bookingError);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmationPopup(false);
    navigate(`/mentee-dashboard/${userId}`);
  };

  const handleBookingErrorClose = () => {
    setBookingErrorPopup(false);
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
        <h3 className='text-center'>Available Sessions</h3>
        {availableSessions.length > 0 ? (
          <ul className="list-group">
            {availableSessions.map((session) => (
              <li
                key={session._id}
                className={`list-group-item session-item ${selectedSession && selectedSession._id === session._id ? 'active' : ''}`}
                onClick={() => setSelectedSession(session)}
              >
                <span className="session-date">
                  {new Date(session.date).toLocaleDateString()}
                </span>
                <span className="session-time">
                  {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="session-duration">
                  ({session.duration} minutes)
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-center'>No available sessions found for this mentor.</p>
        )}
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
        <button className="btn btn-primary" onClick={handleBooking} disabled={!selectedSession}>
          Confirm Booking
        </button>
      </div>

      {showConfirmationPopup && (
        <ConfirmationPopup
          message={confirmationMessage}
          onClose={handleConfirmationClose}
        />
      )}

      {bookingErrorPopup && (
        <ConfirmationPopup
          message={bookingErrorMessage}
          onClose={handleBookingErrorClose}
          isError={true}
        />
      )}
    </div>
  );
};

export default BookSession;