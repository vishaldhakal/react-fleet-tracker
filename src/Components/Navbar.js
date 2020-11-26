import { useHistory, Link } from "react-router-dom";
import DashboardIcon from "./../assests/dashboard.png";
import ReportIcon from "./../assests/reports.png";
import DeviceIcon from "./../assests/device.png";
import AccountIcon from "./../assests/account.png";

function Navbar() {
  const company_name = localStorage.getItem("company_name");
  const history = useHistory();
  const handleLogout = (e) => {
    alert("Logged Out Succesfully!");
    const keys_to_remove = ["token", "refresh_token", "role", "company_name"];
    keys_to_remove.forEach((element) => {
      localStorage.removeItem(element);
    });

    history.push("/login");
  };

  return (
    <>
      <div className="row title-bg py-2 text-light">
        <h4 className="text-center">Fleet Tracker</h4>
      </div>

      <div className="row my-bg1 py-2 px-5">
        <h5 className="text-dark">{company_name}</h5>
      </div>
      <div className="row row-cols-2 text-dark px-5 pt-4">
        <div className="col my-bg2 py-2 text-left">
          <h5 className="myshad">Online</h5>
        </div>
        <div className="col my-bg2 py-2 text-right">
          <span className="badge bg-white text-success ml-2"> 0</span>
        </div>
      </div>
      <div className="row row-cols-2 text-dark px-5 pt-2">
        <div className="col my-bg2 py-2 text-left">
          <h5 className="myshad">Offline</h5>
        </div>
        <div className="col my-bg2 py-2 text-right">
          <span className="badge bg-white text-danger ml-2"> 0</span>
        </div>
      </div>
      <div className="row text-dark mt-5">
        <a
          href="/home"
          onClick={() => {
            window.location.href = "/home";
          }}
          className="text-dark px-5 text-decoration-none"
        >
          <h6 className="my-bg1 py-2 myshad haha">
            <img
              src={DashboardIcon}
              alt="dashboard-icon"
              className="img-fluid mr-2"
            />
            Dashboard
          </h6>
        </a>
      </div>
      <div className="row text-dark mt-1">
        <Link to="/device" className="text-dark px-5 text-decoration-none">
          <h6 className="my-bg1 py-2 myshad px-2 haha">
            <img
              src={DeviceIcon}
              alt="dashboard-icon"
              className="img-fluid mr-2"
            />
            Device
          </h6>
        </Link>
      </div>
      <div className="row text-dark mt-1 px-5">
        <h6 className="my-bg1 py-2 myshad haha">
          <img
            src={ReportIcon}
            alt="dashboard-icon"
            className="img-fluid mr-2"
          />
          Report
        </h6>
      </div>
      <div className="row text-dark mt-1">
        <Link to="/account" className="text-dark px-5 text-decoration-none">
          <h6 className="my-bg1 py-2 myshad px-2 haha">
            <img
              src={AccountIcon}
              alt="dashboard-icon"
              className="img-fluid mr-2"
            />
            Account
          </h6>
        </Link>
      </div>
      <div className="row py-4 px-5 mb-2"></div>
      <div className="row py-2 px-5 mb-2">
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="row py-4">
        <h4 className="px-5 text-dark">Contact : </h4>
        <a
          className="px-5 text-secondary"
          href="mailto:hello@smartlabnepal.com"
        >
          hello@smartlabnepal.com
        </a>
        <a className="px-5 text-secondary" href="tel:+977 986 322 9297">
          9863229297
        </a>
      </div>
    </>
  );
}

export default Navbar;
