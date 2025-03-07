import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MentorProfile.css"; 

const MentorProfile = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/mentors/${mentorId}`);
        setMentor(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

  if (loading) return <div className="loading-container">Loading mentor...</div>;
  if (error) return <div className="error-container">Error: {error.message}</div>;
  if (!mentor) return <div className="not-found-container">Mentor not found.</div>;

  return (
    <div className="mentor-profile-container">
      <div className="profile-header">
        <img
          // src={mentor.profilePicture || "https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg"}
          src={"https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg"}
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
            <strong>Date of Birth:</strong> {mentor.dob ? new Date(mentor.dob).toLocaleDateString() : "N/A"}
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

      <div className="profile-actions">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <button className="book-button" onClick={() => navigate(`/book-session/${mentorId}`)}>
          Book a Session
        </button>
      </div>
    </div>
  );
};

export default MentorProfile;