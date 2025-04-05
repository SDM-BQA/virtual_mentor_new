import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MentorProfile.css";
import { AuthContext } from "../../context/AuthContext";

const MentorProfile = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loggedInMentor, setLoggedInMentor] = useState(null);
  const loggedInUserId = user?.id;

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/mentors/${mentorId}`);
        setMentor(response.data);
        console.log("Fetched Mentor Data:", response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

  useEffect(() => {
    const fetchLoggedInMentor = async () => {
      if (loggedInUserId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/mentors/${loggedInUserId}`);
          setLoggedInMentor(response.data);
  
        } catch (error) {
          console.error("Error fetching logged-in mentor:", error);
        }
      } else {
        setLoggedInMentor(null);
      }
    };

    fetchLoggedInMentor();
  }, [loggedInUserId]);

  const isViewingOwnProfile = loggedInMentor?._id === mentor?._id;
  const isLoggedInAsMentor = !!loggedInMentor;

  if (loading) return <div className="loading-container">Loading mentor...</div>;
  if (error) return <div className="error-container">Error: {error.message}</div>;
  if (!mentor) return <div className="not-found-container">Mentor not found.</div>;


  const profilePictureUrl = mentor?.profilePicture
    ? `http://localhost:5000/${mentor.profilePicture}` // Construct the URL based on your backend's static serving setup
    : "https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg"; // Fallback to placeholder

  return (
    <div className="mentor-profile-container">
      <div className="profile-header">
        <img
          src={profilePictureUrl}
          alt={`${mentor.firstName || "Mentor"} ${mentor.lastName || ""}`}
          className="profile-picture"
        />
        <h2 className="profile-name">
          {mentor.firstName ? `${mentor.firstName} ${mentor.lastName || ""}` : "Name not available"}
        </h2>
        <p className="profile-role">Mentor</p>
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

      <div className="profile-actions">
        <button className="back-button" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
        {isViewingOwnProfile ? (
          <button
            className="dashboard-button"
            onClick={() => navigate(`/mentor-dashboard/${mentor._id}`)}
          > 
            Dashboard
          </button>
        ) : isLoggedInAsMentor ? (
          null // If logged in as a mentor and not viewing own profile, show nothing
        ) : (
          <button
            className="book-button"
            onClick={() => {
              if (user) {
                navigate(`/book-session/${mentorId}`);
              } else {
                navigate('/auth');
              }
            }}
          >
            Book a Session
          </button>
        )}
      </div>
    </div>
  );
};

export default MentorProfile;