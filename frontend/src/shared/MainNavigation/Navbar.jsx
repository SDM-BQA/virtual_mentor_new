import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);


  return (
    <nav id="navbar" className="navbar navbar-expand-lg navbar-dark">
      <div id="nav" className="container-fluid flex">
        <Link className="navbar-brand flex" id="logo" to="/">
          <img src="/logo_final.png" alt="Logo" />
          <p>Virtual Mentor</p>
        </Link>

        {user ? (
          <div className="dropdown">
            <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
              {user.fname} {user.lname}
            </button>
            <ul className="dropdown-menu">
              {user?.id && (
                <li>
                  <Link
                    className="dropdown-item"
                    to={user.mentorIn ? `/profile/mentor/${user.id}` : `/profile/mentee/${user.id}`}
                  >
                    Profile
                  </Link>
                </li>
              )}
              {user?.mentorIn && (
                <li>
                  <Link className="dropdown-item" to={`/mentor-dashboard/${user.id}`}>
                    Mentor Dashboard
                  </Link>
                </li>
              )}
              {!user?.mentorIn && (
                <li>
                  <Link className="dropdown-item" to={`/mentee-dashboard/${user.id}`}>
                    Mentee Dashboard
                  </Link>
                </li>
              )}
              <li>
                <button className="dropdown-item" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/auth" className="btn btn-outline-light">
            Authenticate
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;