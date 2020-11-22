import { useHistory } from "react-router-dom";

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
      <div className="row my-bg2 py-2 text-light">
        <h4 className="text-center">Fleet Tracker</h4>
      </div>
      <div className="row pt-3 px-5">
        <h5 className="text-center font-weight-bold text-light">
          {company_name}
        </h5>
      </div>
      <div className="row py-2 px-5 mb-5">
        <button className="btn btn-light" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="row my-bg2 py-4 text-light">
        <h4 className="text-center">Status</h4>
        <div className="row row-cols-2 py-2 px-5 mx-2">
          <div className="col text-center text-dark bg-light p-3 rounded-left">
            <h1 className="font-weight-bold">2</h1>
            <h4 className="badge bg-success">Online</h4>
          </div>
          <div className="col text-center text-dark bg-light p-3 rounded-right">
            <h1 className="font-weight-bold">0</h1>
            <h4 className="badge bg-danger">Offline</h4>
          </div>
        </div>
      </div>
      <div className="row my-bg py-2 text-light border-bottom">
        <h4 className="px-5">Dashboard</h4>
      </div>
      <div className="row my-bg py-2 text-light border-bottom">
        <h4 className="px-5">Devices</h4>
      </div>
      <div className="row my-bg py-2 text-light border-bottom">
        <h4 className="px-5">Reports</h4>
      </div>
      <div className="row my-bg py-2 text-light">
        <h4 className="px-5">Settings</h4>
      </div>
      <div className="row py-4 text-light my-bg2">
        <h4 className="px-5 text-light">Contact : </h4>
        <a className="px-5 text-light" href="mailto:hello@smartlabnepal.com">
          hello@smartlabnepal.com
        </a>
        <a className="px-5 text-light" href="https://smartlabnepal.com/contact">
          Smartlab Nepal - Research & Development
        </a>
      </div>
    </>
  );
}

export default Navbar;
