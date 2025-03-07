import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Adjust path
import './Dashboard.css'; // Create this CSS file

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Control sidebar toggle

  const handleLogout = () => {
    logout();
    navigate('/auth/login'); // Redirect after logout
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return <div>Please log in to view the dashboard.</div>;
  }

  const isMentor = user.mentorIn !== undefined; // Check if user is a mentor

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? '❮' : '❯'}
        </button>
        <div className="sidebar-content">
          <h2>Dashboard</h2>
          {isMentor ? (
            <>
              <Link to="/mentor-dashboard/total-sessions">Total Sessions</Link>
              <Link to="/mentor-dashboard/upcoming-sessions">Upcoming Sessions</Link>
            </>
          ) : (
            <>
              <Link to="/mentee-dashboard/total-sessions">Total Sessions</Link>
              <Link to="/mentee-dashboard/upcoming-sessions">Upcoming Sessions</Link>
            </>
          )}

          <h2>Upcoming Sessions</h2>
          <Link to="/upcoming-sessions">View All</Link>

          <h2>Notifications</h2>
          <Link to="/notifications">View Notifications</Link>

          <h2>Help</h2>
          <Link to="/help">Get Help</Link>

          <h2>My Profile</h2>
          <Link to={isMentor ? '/profile/mentor' : '/profile/mentee'}>View Profile</Link>

          <h2>Sessions History</h2>
          <Link to="/sessions-history">View History</Link>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className={`main-content ${isSidebarOpen ? 'open' : ''}`}>
        {/* Main content here */}
        <h1>Welcome to the Dashboard</h1>
        <p>This is where the main dashboard content will go.</p>
        {/* Add your dashboard content here */}
      </main>
    </div>
  );
};

export default Dashboard;