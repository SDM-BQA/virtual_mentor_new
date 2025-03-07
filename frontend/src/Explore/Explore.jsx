import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Explore.css";
import { Link } from "react-router-dom";

const Explore = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mentorsResponse = await axios.get("http://localhost:5000/api/mentors");
        setMentors(mentorsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Explore Mentors</h2>
      <div className="row">
        {mentors.map((mentor) => (
          <div key={mentor._id} className="col-md-4 mb-4">
            <div className="card mentor-card">
              <img
                // src={mentor.profilePicture || "https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg"}
                src={"https://adaptcommunitynetwork.org/wp-content/uploads/2023/09/person-placeholder.jpg"}
                className="card-img-top"
                alt={`${mentor.firstName} ${mentor.lastName}`}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {mentor.firstName} {mentor.lastName}
                </h5>
                <p className="card-text"><strong>Mentor In:</strong> {mentor.mentorIn}</p>
                <p className="card-text"><strong>Experience:</strong> {mentor.experience} years</p>
                <p className="card-text"><strong>City:</strong> {mentor.city}</p>
                <p className="card-text"><strong>Country:</strong> {mentor.country}</p>
                <Link to={`/profile/mentor/${mentor._id}`} className="btn btn-primary">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;