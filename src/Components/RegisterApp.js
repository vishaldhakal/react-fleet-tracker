import "./LoginApp.css";
import TrackingGif from "./../assests/tracking.gif";
import { useState } from "react";
import axios from "axios";
import config from "./../config";
import { useHistory, Link } from "react-router-dom";

function LoginApp() {
  const [registererror, setRegistererror] = useState("");
  const history = useHistory();
  const [credentials, setcredentials] = useState({
    companyName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setcredentials((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    /* console.log(credentials); */
  };

  const handleSubmit = (e) => {
    const payload = JSON.stringify({
      companyName: credentials.companyName,
      email: credentials.email,
      password: credentials.password,
      phone: credentials.phone,
      role: credentials.role,
    });
    var configg = {
      method: "POST",
      credentials: "include",
      url: `${config.baseUrl}/register`,
      headers: { "Content-Type": "text/plain" },
      data: payload,
    };
    axios(configg)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          localStorage.setItem("token", res.data.access_token);
          localStorage.setItem("company_name", res.data.companyName);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("refresh_token", res.data.refresh_token);
          history.push("/home");
        } else {
          setRegistererror(res.statusText);
        }
      })
      .catch(function (error) {
        console.log(error.response.status);
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
              <div className="my-box">{registererror}</div>
              <form action="">
                <div className="mb-3">
                  <label htmlFor="companyName" className="form-label">
                    Enter Company Name:
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    className="form-control"
                    value={credentials.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
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
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Enter Phone Number:
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    className="form-control"
                    value={credentials.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Enter Your Role:
                  </label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    className="form-control"
                    value={credentials.role}
                    onChange={handleChange}
                    required
                  />
                </div>
                <input
                  type="submit"
                  className="btn d-block btn-success"
                  value="Register Now"
                  onClick={handleSubmit}
                ></input>
              </form>
              <p className="text-secondary pt-5">
                Already have an account ?{" "}
                <Link to="/login" className="text-primary">
                  Login Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginApp;
