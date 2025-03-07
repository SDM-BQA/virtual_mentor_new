import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const AdminLogin = () => {
  return (
    <div className="login-container">
      <div className="login-box p-4">
        <h2 className="text-center mb-4">Admin Login</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Enter your email" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
