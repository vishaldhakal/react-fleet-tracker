import Antpath from "./Antpath";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import axios from "axios";
import config from "./../config";

let my_random_data = [
  [27.666997, 85.290863],
  [27.666997, 85.207873],
  [27.666997, 85.257873],
  [27.688998, 85.290863],
];

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
    endingDate:
      today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate(),
    device: "",
  });

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
      iconSize: [100, 95], // size of the icon
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
      /* let antPolyline = new AntPath(my_random_data, { color: "red" });
      antPolyline.addTo(context.map); */

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
      const mystr =
        today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
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
      <form className="mysearch">
        <input
          type="date"
          className="form-control mydateinput mybord"
          value={searchdata.startingDate}
        />
        <input
          type="date"
          className="form-control mydateinput"
          value={searchdata.endingDate}
        />
        <input
          className="form-control searchinput"
          type="search"
          placeholder="Search for Vehicle"
          aria-label="Search"
        />
        <button className="btn searchbtn" type="submit">
          <svg
            width="2em"
            height="1.2em"
            viewBox="0 0 16 16"
            class="bi bi-search"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"
            />
            <path
              fillRule="evenodd"
              d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"
            />
          </svg>
        </button>
      </form>
      <div id="map">
        <MapContainer
          center={center_position}
          zoom={13}
          scrollWheelZoom={false}
        >
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
              {/* <Polyline
                positions={singlemarkerdata}
                pathOptions={{ color: "green" }}
              ></Polyline> */}
              <Antpath
                positions={singlemarkerdata}
                options={{ color: "blue", weight: 8 }}
              />
              <Marker
                position={singlemarkerdata[0]}
                key={singlemarker.fleetIMEINumber}
                icon={selectIcon(singlemarker.fleetType)}
              >
                <Tooltip>
                  <div className="text-success">
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
                  Ending Point :{" "}
                  {singlemarkerdata[singlemarkerdata.length - 1][0]},
                  {singlemarkerdata[singlemarkerdata.length - 1][1]}
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
                <div className="text-danger">
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
