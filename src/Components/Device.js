import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import config from "./../config";

function DeviceApp() {
  const [devicedata, setDevicedata] = useState(null);
  const [mydata, setMydata] = useState(null);
  const [editerror, setEditerror] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setMydata((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    /* console.log(mydata); */
  };

  const handleSubmit = (e) => {
    console.log("Submit handling");
    const token = localStorage.getItem("token");
    const payload = JSON.stringify({
      fleetIMEINumber: mydata.fleetIMEINumber,
      fleetName: mydata.fleetName,
      projectName: mydata.projectName,
      PhoneNumber: mydata.fleetPhoneNumber,
      fleetModel: mydata.fleetModel,
    });
    var configg = {
      method: "POST",
      credentials: "include",
      url: `${config.baseUrl}/edit-a-vehicle-details`,
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    };
    axios(configg)
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          setMydata(null);
        } else {
          setEditerror("Sorry Unable to Edit the Data ! Please Try again");
        }
      })
      .catch(function (error) {
        console.log(error.response.status);
        setEditerror("Sorry Unable to Edit the Data");
      });
    e.preventDefault();
  };

  useEffect(() => {
    if (mydata == null) {
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
    }
  }, [mydata]);

  return (
    <>
      <div className="row no-pad row-cols-1 row-cols-md-2">
        <div className="col-md-2">
          <Navbar />
        </div>
        <div className="col-md-10 bg-light">
          <div className="conatiner p-5">
            {!mydata && (
              <table className="table bg-white p-5 table-responsive">
                <thead>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">IMEI Number</th>
                    <th scope="col">Type / Model</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {devicedata &&
                    devicedata.map((devdata, index) => (
                      <tr key={devdata.fleetIMEINumber}>
                        <th scope="row">{index + 1}</th>
                        <td>{devdata.fleetName}</td>
                        <td>{devdata.fleetIMEINumber}</td>
                        <td>
                          {devdata.fleetType} / {devdata.fleetModel}
                        </td>
                        <td>{devdata.fleetPhoneNumber}</td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() => {
                              setMydata(devdata);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
            {mydata && (
              <div className="px-0 px-md-5">
                <h5 className="text-center p-3 bg-success text-white rounded shadow-sm">
                  Edit Your Vehicle data
                </h5>
                {editerror && <div>{editerror}</div>}
                <form className="bg-white p-4 shadow-sm rounded mt-5" action="">
                  <div className="mb-3">
                    <label htmlFor="fleetName" className="form-label">
                      Fleet Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fleetName"
                      name="fleetName"
                      value={mydata.fleetName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fleetPhoneNumber" className="form-label">
                      Fleet Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fleetPhoneNumber"
                      name="fleetPhoneNumber"
                      value={mydata.fleetPhoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fleetModel" className="form-label">
                      Fleet Model
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fleetModel"
                      name="fleetModel"
                      value={mydata.fleetModel}
                      onChange={handleChange}
                    />
                  </div>
                  <input
                    type="submit"
                    value="Confirm Edit"
                    className="btn btn-success"
                    onClick={handleSubmit}
                  />
                  <button
                    className="btn btn-danger mx-0 mx-md-5 my-4 my-md-0"
                    onClick={() => {
                      setMydata(null);
                    }}
                  >
                    Cancle Edit
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DeviceApp;
