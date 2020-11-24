import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import config from "./../config";

function DeviceApp() {
  const [devicedata, setDevicedata] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    var configg = {
      method: "get",
      credentials: "include",
      url: `${config.baseUrl}/all-vehicle-last-position-with-details`,
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    axios(configg)
      .then((res) => {
        console.log(res.data);
        setDevicedata(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  return (
    <>
      <div className="row no-pad row-cols-1 row-cols-md-2">
        <div className="col-md-2">
          <Navbar />
        </div>
        <div className="col-md-10 bg-light">
          <div className="conatiner p-5">
            <table className="table bg-white p-5 table-responsive">
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Name</th>
                  <th scope="col">IMEI Number</th>
                  <th scope="col">Contact</th>
                </tr>
              </thead>
              <tbody>
                {devicedata &&
                  devicedata.map((devdata, index) => (
                    <tr key={devdata.fleetIMEINumber}>
                      <th scope="row">{index + 1}</th>
                      <td>{devdata.fleetName}</td>
                      <td>{devdata.fleetIMEINumber}</td>
                      <td>{devdata.fleetPhoneNumber}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeviceApp;
