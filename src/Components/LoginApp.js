import "./LoginApp.css";
import TrackingGif from "./../assests/tracking.gif";
import { useState } from "react";
import axios from "axios";

function LoginApp() {
  const [credentials, setcredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setcredentials((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    console.log(credentials);
  };

  const handleSubmit = (e) => {
    /* http://167.71.225.146:8080/login */
    const payload = JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    });
    axios.post("http://167.71.225.146:8080/login", { payload }).then((res) => {
      console.log(res);
      console.log(res.data);
    });
    e.preventDefault();
  };

  return (
    <>
      <div className="conatiner mycont">
        <div className="row row-cols-1 row-cols-md-2">
          <div className="col">
            <img
              src={TrackingGif}
              className="p-2 p-sm-5 img-fluid"
              alt="Gif for tracking"
            ></img>
          </div>
          <div className="col just p-5">
            <div className="container bg-light shadow-sm rounded p-5">
              <h1>Login</h1>
              <form action="">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Enter Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Enter Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="form-control"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <input
                  type="submit"
                  className="btn d-block btn-success"
                  value="Login"
                  onClick={handleSubmit}
                ></input>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginApp;
