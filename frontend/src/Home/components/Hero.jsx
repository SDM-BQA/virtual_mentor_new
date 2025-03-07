import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Hero.css";
import bgImage from "../../assets/bg.jpg";

const Hero = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      if (user.mentorIn) {
        navigate("/explore"); // or navigate to mentor specific page if needed
      } else {
        navigate(`/profile/mentee/${user._id}`); // Navigate to mentee profile
      }
    } else {
      navigate("/auth");
    }
  };

  const handleExplore = () => {
    navigate("/explore");
  };

  return (
    <div
      className="hero-section d-flex align-items-center justify-content-center text-center text-white"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="container">
        <h1 className="display-4 fw-bold">Indian Art Mentor</h1>
        <p className="lead">
          A platform to explore, learn, and mentor in the world of Indian art.
        </p>

        <div className="d-flex justify-content-center mt-4">
          <button
            onClick={handleGetStarted}
            className="btn btn-primary btn-lg me-3"
          >
            {user
              ? user.mentorIn
                ? "Featured Mentors"
                : "Profile"
              : "Get Started"}
          </button>
          <Link to={"/explore"} className="btn btn-outline-light btn-lg">
            Explore Mentors
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;