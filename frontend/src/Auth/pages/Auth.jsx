import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-75 shadow-lg p-5 rounded bg-light">
        {/* Left Side - Login Options */}
        <div className="col-md-6 text-center border-end">
          <h3 className="mb-4">Login</h3>
          <button
            className="btn btn-primary w-75 mb-3 py-2" // Added py-2 for height
            onClick={() => navigate("/auth/login")}
          >
            User Login
          </button>
          <button
            className="btn btn-secondary w-75 py-2" // Added py-2 for height
            onClick={() => navigate("/auth/admin-login")}
          >
            Admin Login
          </button>
        </div>

        {/* Right Side - Signup Options */}
        <div className="col-md-6 text-center">
          <h3 className="mb-4">Sign Up</h3>
          <button
            className="btn btn-success w-75 mb-3 py-2" // Added py-2 for height
            onClick={() => navigate("/auth/mentorregister")}
          >
            Mentor Sign Up
          </button>
          <button
            className="btn btn-info w-75 py-2" // Added py-2 for height
            onClick={() => navigate("/auth/menteeregister")}
          >
            Mentee Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;