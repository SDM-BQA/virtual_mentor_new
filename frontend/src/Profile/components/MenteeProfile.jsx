import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './MenteeProfile.css'; // Import CSS

const MenteeProfile = () => {
  const { user, loading, getUserFromLocalStorage } = useContext(AuthContext);
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    if (!user) {
      const storedUser = getUserFromLocalStorage();
      setLocalUser(storedUser);
    }
  }, [user, getUserFromLocalStorage]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  const userData = user || localUser;

  if (!userData) {
    return <div className="no-user-container">Please log in to view your profile.</div>;
  }

  return (
    <div className="mentee-profile-container">
      <div className="profile-header">
        <img
          // src={userData?.profilePicture || 'https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg'}
          src={'https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg'}
          alt="Profile"
          className="profile-picture"
        />
        <h2 className="profile-name">
          {userData?.fname} {userData?.lname}
        </h2>
        <p className="profile-role">Mentee</p>
      </div>

      <div className="profile-details">
        <div className="detail-section">
          <p>
            <strong>Email:</strong> {userData?.email}
          </p>
          <p>
            <strong>Mobile:</strong> {userData?.mobile}
          </p>
          <p>
            <strong>Gender:</strong> {userData?.gender}
          </p>
          <p>
            <strong>Date of Birth:</strong> {userData?.dob && new Date(userData.dob).toLocaleDateString()}
          </p>
          <p>
            <strong>Location:</strong> {userData?.city}, {userData?.state}, {userData?.country}
          </p>
        </div>

        <div className="bio-section">
          <strong>Short Bio:</strong>
          <p>{userData?.bio || 'No bio available'}</p>
        </div>
      </div>

      <div className="profile-actions">
        <button className="back-button" onClick={() => window.history.back()}>
          Back
        </button>
      </div>
    </div>
  );
};

export default MenteeProfile;