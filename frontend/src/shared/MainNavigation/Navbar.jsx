import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav id="navbar" className="navbar navbar-expand-lg navbar-dark">
      <div id="nav" className="container-fluid flex">
        <Link className="navbar-brand flex" id="logo" to="/">
          <img src="/logo_final.png" alt="Logo" />
          <p>Virtual Mentor</p>
        </Link>

        <div className="d-flex align-items-center">
          <Link to="/" className="btn btn-outline-light me-2 d-none d-lg-block">
            Home
          </Link>
          <Link to="/explore" className="btn btn-outline-light me-2 d-none d-lg-block">
            Explore
          </Link>

          {user ? (
            <div className="dropdown me-2 d-none d-lg-block">
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
            <Link to="/auth" className="btn btn-outline-light d-none d-lg-block">
              Authenticate
            </Link>
          )}

          <button className="btn btn-outline-light d-lg-none" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <Link to="/" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>Home</Link>
          <Link to="/explore" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>Explore</Link>
          {user ? (
            <>
              {user?.id && (
                <Link
                  className="sidebar-link"
                  to={user.mentorIn ? `/profile/mentor/${user.id}` : `/profile/mentee/${user.id}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Profile
                </Link>
              )}
              {user?.mentorIn && (
                <Link className="sidebar-link" to={`/mentor-dashboard/${user.id}`} onClick={() => setIsSidebarOpen(false)}>
                  Mentor Dashboard
                </Link>
              )}
              {!user?.mentorIn && (
                <Link className="sidebar-link" to={`/mentee-dashboard/${user.id}`} onClick={() => setIsSidebarOpen(false)}>
                  Mentee Dashboard
                </Link>
              )}
              <button className="sidebar-link" onClick={() => { logout(); setIsSidebarOpen(false); }}>Logout</button>
            </>
          ) : (
            <Link to="/auth" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>Authenticate</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;