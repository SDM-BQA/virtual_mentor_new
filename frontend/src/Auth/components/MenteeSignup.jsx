import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const MenteeSignup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (profilePic) {
        formData.append("profilePicture", profilePic);
      }

      const response = await axios.post("http://localhost:5000/api/mentees/menteeregister", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data.message);
      navigate("/"); // Redirect after successful registration
    } catch (error) {
      console.error("Registration Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Mentee Registration</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <label>First Name</label>
            <input type="text" className="form-control" {...register("fname", { required: "First name is required" })} />
            {errors.fname && <p className="text-danger">{errors.fname.message}</p>}
          </div>
          <div className="col-md-6">
            <label>Last Name</label>
            <input type="text" className="form-control" {...register("lname", { required: "Last name is required" })} />
            {errors.lname && <p className="text-danger">{errors.lname.message}</p>}
          </div>
        </div>

        <label>Email</label>
        <input type="email" className="form-control" {...register("email", { required: "Email is required" })} />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}

        <label>Mobile</label>
        <input type="text" className="form-control" {...register("mobile", { required: "Mobile number is required" })} />
        {errors.mobile && <p className="text-danger">{errors.mobile.message}</p>}

        <label>Gender</label>
        <select className="form-control" {...register("gender", { required: "Select gender" })}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="text-danger">{errors.gender.message}</p>}

        <label>Date of Birth</label>
        <input type="date" className="form-control" {...register("dob", { required: "Date of birth is required" })} />
        {errors.dob && <p className="text-danger">{errors.dob.message}</p>}

        <label>Password</label>
        <input
          type="password"
          className="form-control"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && <p className="text-danger">{errors.password.message}</p>}

        <label>Country</label>
        <input type="text" className="form-control" {...register("country", { required: "Country is required" })} />
        {errors.country && <p className="text-danger">{errors.country.message}</p>}

        <label>State</label>
        <input type="text" className="form-control" {...register("state", { required: "State is required" })} />
        {errors.state && <p className="text-danger">{errors.state.message}</p>}

        <label>City</label>
        <input type="text" className="form-control" {...register("city", { required: "City is required" })} />
        {errors.city && <p className="text-danger">{errors.city.message}</p>}

        <label>Profile Picture</label>
        <input type="file" className="form-control" onChange={(e) => setProfilePic(e.target.files[0])} />

        <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>
      </form>

      <p className="mt-3 text-center">
        Already have an account? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/auth/login")}>Login</span>
      </p>
    </div>
  );
};

export default MenteeSignup;