import Antpath from "./Antpath";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import axios from "axios";
import config from "./../config";

let my_random_data = [
  [27.666997, 85.290863],
  [27.666997, 85.207873],
  [27.686997, 85.257873],
  [27.688998, 85.290863],
];

function MyComponent(props) {
  const map = useMap();
  map.setView(props.centerr);
  return null;
}

function LeafletMap() {
  const today = new Date();
  const [markings, setMarkings] = useState(null);
  const [center_position, setCenterPosition] = useState([27.666997, 85.290863]);
  const [singlemarkerdatanot, setSinglemarkerdatanot] = useState(null);
  const [singlemarkerdata, setSinglemarkerdata] = useState(null);
  const [singlemarker, setSinglemarker] = useState(null);
  const [searchdata, setSearchdata] = useState({
    startingDate:
      today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate(),
    device: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSearchdata((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    console.log(searchdata);
  };

  const handleSubmit = (e) => {
    if (searchdata.device !== "") {
      markings.forEach((element) => {
        if (element.fleetIMEINumber === searchdata.device) {
          setSinglemarker(element);
        }
      });
      setMarkings(null);
    }
    e.preventDefault();
  };

  const selectIcon = (typee) => {
    let myiconurlSelect;
    if (typee === "Car") {
      myiconurlSelect = "https://img.icons8.com/color/96/000000/car.png";
    } else if (typee === "Bike") {
      myiconurlSelect =
        "https://img.icons8.com/doodle/96/000000/motorcycle.png";
    } else {
      myiconurlSelect =
        "https://img.icons8.com/fluent/96/000000/location-update.png";
    }
    var myIcon = L.icon({
      iconUrl: myiconurlSelect,
      iconSize: [48, 48], // size of the icon
      iconAnchor: [20, 15],
    });
    return myIcon;
  };

  function convertIMEI(strr) {
    var n = "02" + strr.slice(5);
    console.log(n);
    return n;
  }

  const markerClickHandler = () => {
    setMarkings(null);
  };

  const socket = new WebSocket("ws://167.71.225.146:3000");

  useEffect(() => {
    if (singlemarker == null) {
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
          if (res.status === 200) {
            setMarkings(res.data);
          } else {
            const keys_to_remove = [
              "token",
              "refresh_token",
              "role",
              "company_name",
            ];
            keys_to_remove.forEach((element) => {
              localStorage.removeItem(element);
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      const token = localStorage.getItem("token");
      var today = new Date();
      let mystr;
      if (searchdata.device === "") {
        mystr =
          today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
      } else {
        mystr = searchdata.startingDate;
      }
      var configgg = {
        method: "get",
        credentials: "include",
        url: `${
          config.baseUrl
        }/one-vehicle-daily-history?vehicleID=${convertIMEI(
          singlemarker.fleetIMEINumber
        )}&date=${mystr}`,
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Bearer ${token}`,
        },
      };
      axios(configgg)
        .then((res) => {
          console.log(
            "Request for single vehicle data response : ",
            res.status,
            res
          );
          if (res.status !== 204) {
            setSinglemarkerdata(res.data);
          } else {
            setSinglemarkerdata(my_random_data);
            console.log("Setting single Vehicle donot have any data for today");
            /* setSinglemarkerdatanot(singlemarker); */
            if (singlemarker.latitude === "" || singlemarker.longitude === "") {
              setCenterPosition([0, 0]);
              alert("Sorry Vehicle Donot have any Position by now");
            } else {
              setCenterPosition([
                parseFloat(singlemarker.latitude),
                parseFloat(singlemarker.longitude),
              ]);
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log("Single data fetching from server of date : ", mystr);
    }
  }, [singlemarker]);

  // Connection opened
  socket.addEventListener("open", function (event) {
    if (markings != null) {
      markings.forEach((mark) => {
        socket.send(
          JSON.stringify({
            action: "subscribe",
            topic: convertIMEI(mark.fleetIMEINumber),
          })
        );
        console.log(socket.readyState);
      });
    }
  });

  // Listen for messages
  socket.addEventListener("message", function (event) {
    var json_response = JSON.parse(event.data);
    markings.forEach((mark) => {
      if (convertIMEI(mark.fleetIMEINumber) === json_response.deviceID) {
        setMarkings(
          markings.map((item) =>
            item.fleetIMEINumber === mark.fleetIMEINumber
              ? {
                  ...item,
                  longitude: json_response.longitude,
                  latitude: json_response.latitude,
                }
              : item
          )
        );
      }
    });
  });

  return (
    <>
      {markings && (
        <form className="mysearch shadow-lg">
          <input
            type="date"
            id="startingDate"
            className="form-control mydateinput mybord no-border"
            value={searchdata.startingDate}
            onChange={handleChange}
          />
          <select
            id="device"
            className="form-select searchinput no-border"
            value={searchdata.device}
            onChange={handleChange}
          >
            <option>Select a Vehicle</option>
            {markings.map((mark, index) => (
              <option value={mark.fleetIMEINumber} key={mark.fleetIMEINumber}>
                {mark.fleetName}
              </option>
            ))}
          </select>

          <input
            type="submit"
            value="Search"
            name="Search"
            className="searchbtn p-3"
            onClick={handleSubmit}
          />
        </form>
      )}
      <div id="map">
        <MapContainer
          center={center_position}
          zoom={13}
          scrollWheelZoom={false}
        >
          <MyComponent centerr={center_position} />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markings &&
            markings.map((mark, index) => (
              <Marker
                position={[mark.latitude, mark.longitude]}
                key={mark.fleetIMEINumber}
                icon={selectIcon(mark.fleetType)}
                eventHandlers={{
                  click: (e) => {
                    setSinglemarker(mark);
                    markerClickHandler();
                  },
                }}
              >
                <Tooltip direction="top" opacity={1} permanent>
                  {mark.fleetName}
                </Tooltip>
              </Marker>
            ))}
          {singlemarker && singlemarkerdata && (
            <div>
              <Antpath
                positions={singlemarkerdata}
                options={{ color: "blue", weight: 6 }}
              />
              <Marker
                position={singlemarkerdata[0]}
                key={singlemarker.fleetIMEINumber}
                icon={selectIcon(singlemarker.fleetType)}
              >
                <Tooltip>
                  <div className="text-center">
                    <h5 className="badge text-decoration-underline text-success">
                      {singlemarker.fleetName}
                    </h5>
                    <br />
                    Starting Point : {singlemarkerdata[0][0]},
                    {singlemarkerdata[0][1]}
                  </div>
                </Tooltip>
              </Marker>
              <Marker
                position={singlemarkerdata[singlemarkerdata.length - 1]}
                key={singlemarker.fleetName}
                icon={selectIcon(singlemarker.fleetType)}
              >
                <Tooltip>
                  <div className="text-center">
                    <h6 className="badge text-decoration-underline text-success">
                      {singlemarker.fleetName}
                    </h6>
                    <br />
                    Ending Point :{" "}
                    {singlemarkerdata[singlemarkerdata.length - 1][0]},
                    {singlemarkerdata[singlemarkerdata.length - 1][1]}
                  </div>
                </Tooltip>
              </Marker>
            </div>
          )}
          {singlemarkerdatanot && (
            <Marker
              position={[
                singlemarkerdatanot.latitude,
                singlemarkerdatanot.longitude,
              ]}
              key={singlemarkerdatanot.fleetIMEINumber}
              icon={selectIcon(singlemarkerdatanot.fleetType)}
            >
              <Tooltip permanent>
                <div className="text-center">
                  Sorry No any data available for this vehicle !
                </div>
              </Tooltip>
            </Marker>
          )}
        </MapContainer>
      </div>
    </>
  );
}

export default LeafletMap;
