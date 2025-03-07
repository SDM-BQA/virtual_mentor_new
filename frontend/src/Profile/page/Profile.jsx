// Profile.js
import  { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import MentorProfile from "../components/MentorProfile";
import MenteeProfile from "../components/MenteeProfile";

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div>
      {user.isMentor ? <MentorProfile /> : <MenteeProfile />}
    </div>
  );
};

export default Profile;