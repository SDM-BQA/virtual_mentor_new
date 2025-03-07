import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoginError(null);

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
      setLoginError(error.message || "Invalid credentials or server error.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box p-4">
        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-danger text-center">{errors.email.message}</p>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="text-danger text-center">{errors.password.message}</p>}
          </div>

          {loginError && <p className="text-danger text-center">{loginError}</p>} {/* Added text-center */}

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <p className="mt-3 text-center">
          Don&apos;t have an account? <Link to="/auth">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;