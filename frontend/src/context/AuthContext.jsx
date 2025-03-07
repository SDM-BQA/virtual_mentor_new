// import { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error("Error parsing user from localStorage:", error);
//         localStorage.removeItem("user"); // Remove invalid data
//       }
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }

//       const data = await response.json();
//       const userData = {
//         token: data.token,
//         ...data.user, // Spread the full user object from the backend
//       };

//       localStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);

//       console.log(userData);

//     } catch (error) {
//       console.error("Login failed:", error.message);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false); // Set loading to false after attempting to retrieve user
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json(); // Parse response first
  
      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }
  
      const userData = {
        token: data.token,
        ...data.user,
      };
  
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      console.log("AuthContext Login User:", userData);
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error; // ✅ Throw error so `Login.jsx` can handle it
    } finally {
      setLoading(false);
    }
  };
  

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/');
  };

  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getUserFromLocalStorage }}>
      {children}
    </AuthContext.Provider>
  );
};