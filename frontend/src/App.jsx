import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./shared/MainNavigation/Navbar";
import Login from "./Auth/components/Login.jsx";
import Home from "./Home/pages/Home";
import "./index.css";
import Auth from "./Auth/pages/Auth";
import Footer from "./shared/Footer/Footer";
import MentorSignUp from "./Auth/components/MentorSignUp";
import MenteeSignup from "./Auth/components/MenteeSignup";
import AdminLogin from "./Auth/components/AdminLogin";
import Profile from "./Profile/page/Profile.jsx";
import MentorProfile from "./Profile/components/MentorProfile.jsx";
import MenteeProfile from "./Profile/components/MenteeProfile.jsx";
import Explore from "./Explore/Explore.jsx";
import MenteeDashboard from "./Dashboard/MenteeDashboard.jsx";
import MentorDashboard from "./Dashboard/MentorDashboard.jsx";
import BookSession from "./BookSession/BookSession.jsx";
import React, { useState, useEffect } from 'react';
import LoadingScreen from './shared/UIElement/LoadingScreen.jsx'; // Import LoadingScreen
import ChatBot from './ChatBot/Chatbot.jsx'


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Router>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/mentorregister" element={<MentorSignUp />} />
              <Route path="/auth/menteeregister" element={<MenteeSignup />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/admin-login" element={<AdminLogin />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/dashboard" element={<h1>Dashboard (Protected)</h1>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/mentor" element={<MentorProfile />} />
              <Route path="/profile/mentee" element={<MenteeProfile />} />
              <Route path="/profile/mentor/:mentorId" element={<MentorProfile />} />
              <Route path="/profile/mentee/:menteeId" element={<MenteeProfile />} />
              <Route path="mentor-dashboard/:userId" element={<MentorDashboard />} />
              <Route path="mentee-dashboard/:userId" element={<MenteeDashboard />} />
              <Route path="/book-session/:mentorId" element={<BookSession />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <ChatBot/>
            <Footer />
          </AuthProvider>
        </Router>
      )}
    </>
  );
}

export default App;