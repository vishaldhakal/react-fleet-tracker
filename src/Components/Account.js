import "./Home.css";
import Navbar from "./Navbar";
import avatar from "./../assests/avatar.png";

function AccountApp() {
  return (
    <>
      <div className="row no-pad row-cols-1 row-cols-md-2">
        <div className="col-md-2">
          <Navbar />
        </div>
        <div className="col-md-10 bg-light">
          <div className="conatiner p-0 p-md-5">
            <div className="px-0 px-md-5">
              <div className="bg-white p-1 p-md-4 rounded shadow-sm">
                <div className="row row-cols-1">
                  <div className="col text-center">
                    <img
                      src={avatar}
                      alt="avatar"
                      className="img-fluid rounded-circle"
                    />
                    <h4 className="mt-3">User Name</h4>
                    <span className="text-secondary">useremail@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountApp;
