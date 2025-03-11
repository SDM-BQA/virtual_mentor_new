import axios from "axios"; // Import Axios
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const MentorSignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const categories = [
    "Painting",
    "Sketching",
    "Sculpture",
    "Dancing",
    "Singing",
    "Theatre",
    "Photography",
    "Writing",
    "Music Composition",
    "Graphic Design",
    "Film Making",
  ];

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      const response = await axios.post(
        "http://localhost:5000/api/mentors/mentorregister",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(response.data.message);
      reset();
      navigate("/auth/login");
    } catch (error) {
      alert(
        "Error: " + error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Mentor Registration</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 border rounded shadow"
      >
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              {...register("firstName", { required: true })}
            />
            {errors.firstName && (
              <small className="text-danger">First name is required</small>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              {...register("lastName", { required: true })}
            />
            {errors.lastName && (
              <small className="text-danger">Last name is required</small>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors.email && (
              <small className="text-danger">Valid email is required</small>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label>Mobile Number</label>
            <input
              type="text"
              className="form-control"
              {...register("mobile", {
                required: true,
                pattern: /^[0-9]{10}$/,
              })}
            />
            {errors.mobile && (
              <small className="text-danger">
                Enter a valid 10-digit mobile number
              </small>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Gender</label>
            <select
              className="form-control"
              {...register("gender", { required: true })}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <small className="text-danger">Gender is required</small>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label>Date of Birth</label>
            <input
              type="date"
              className="form-control"
              {...register("dob", { required: true })}
            />
            {errors.dob && (
              <small className="text-danger">Date of birth is required</small>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Country</label>
            <input
              type="text"
              className="form-control"
              {...register("country", { required: true })}
            />
            {errors.country && (
              <small className="text-danger">Country is required</small>
            )}
          </div>
          <div className="col-md-4 mb-3">
            <label>State</label>
            <input
              type="text"
              className="form-control"
              {...register("state", { required: true })}
            />
            {errors.state && (
              <small className="text-danger">State is required</small>
            )}
          </div>
          <div className="col-md-4 mb-3">
            <label>City</label>
            <input
              type="text"
              className="form-control"
              {...register("city", { required: true })}
            />
            {errors.city && (
              <small className="text-danger">City is required</small>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && (
              <small className="text-danger">
                Password must be at least 6 characters
              </small>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              {...register("confirmPassword", {
                required: true,
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <small className="text-danger">
                {errors.confirmPassword.message}
              </small>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>You want to Mentor in?</label>
            <select
              className="form-control"
              {...register("mentorIn", { required: true })}
            >
              <option value="">Select</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.mentorIn && (
              <small className="text-danger">Please select a category</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label>Experience (Years)</label>
            <input
              type="number"
              className="form-control"
              {...register("experience", { required: true, min: 1 })}
            />
            {errors.experience && (
              <small className="text-danger">
                Valid experience is required
              </small>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label>Awards/Achievements</label>
          <textarea
            className="form-control"
            rows="2"
            {...register("awards")}
          ></textarea>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Social Media Links</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Instagram"
              {...register("instagram")}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="LinkedIn"
              {...register("linkedin")}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Twitter"
              {...register("twitter")}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Facebook"
              {...register("facebook")}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Promotional Video Link</label>
            <input
              type="url"
              className="form-control"
              {...register("videoLink")}
            />
          </div>
        </div>

        <div className="mb-3">
          <label>Profile Picture</label>
          <input
            type="file"
            className="form-control"
            {...register("profilePicture")}
          />
        </div>

        <div className="mb-3">
          <label>Short Bio</label>
          <textarea
            className="form-control"
            rows="3"
            {...register("bio")}
          ></textarea>
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => reset()}
          >
            Clear Fields
          </button>
        </div>
      </form>
      <p className="mt-3 text-center">
        Already have an account?{" "}
        <span
          className="text-primary"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/auth/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default MentorSignUp;
