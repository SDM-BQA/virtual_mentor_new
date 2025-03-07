import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Hero.css";
import bgImage from "../../assets/bg.jpg";

const Hero = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/explore");
    } else {
      navigate("/auth");
    }
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

        <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
          {user ? (
            user.isMentor ? "Featured Mentors" : "Explore Mentors"
          ) : (
            "Get Started"
          )}
        </button>
      </div>
    </div>
  );
};

export default Hero;