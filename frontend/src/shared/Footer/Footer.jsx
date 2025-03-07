import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer" className="container-fluid">
      <div className="container text-center">
        <div id="footer-content" className="row justify-content-center py-3">
          <div className="col-md-4">
            <Link to={"/"} className="footer-link">
              CMR Institute of Technology,132 AECS Layout ITPL Main Road,
              Kundalahalli Bangalore 560037, India
            </Link>
          </div>
          <div className="col-md-3">
            <Link to={"/"} className="footer-link">
              +91 80 28524466 / 77
            </Link>
          </div>
          <div className="col-md-3">
            <Link to={"/"} className="footer-link">
              info@cmrit.ac.in
            </Link>
          </div>
        </div>

        <div id="foot" className="d-flex flex-column flex-md-row justify-content-between align-items-center py-3">
          <p className="mb-2 mb-md-0">
            © <Link className="link" target="_blank" to={"https://www.cmrit.ac.in"}>
              CMRIT
            </Link>, All Right Reserved.
          </p>
          <p className="mb-0">Designed By MCA Department</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
