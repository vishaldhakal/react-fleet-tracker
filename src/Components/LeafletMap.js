import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import axios from "axios";
import config from "./../config";

let my_random_data = [
  [27.666997, 85.290863],
  [27.766997, 85.290863],
];

function LeafletMap() {
  const [markings, setMarkings] = useState(null);
  const [center_position, setCenterPosition] = useState([27.666997, 85.290863]);
  const [singlemarkerdatanot, setSinglemarkerdatanot] = useState(null);
  const [singlemarkerdata, setSinglemarkerdata] = useState(null);
  const [singlemarker, setSinglemarker] = useState(null);

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
          setMarkings(res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      const token = localStorage.getItem("token");
      var configgg = {
        method: "get",
        credentials: "include",
        url: `${
          config.baseUrl
        }/one-vehicle-daily-history?vehicleID=${convertIMEI(
          singlemarker.fleetIMEINumber
        )}&date=2020-10-20`,
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Bearer ${token}`,
        },
      };
      axios(configgg)
        .then((res) => {
          console.log(res.status);
          if (res.status != 204) {
            setSinglemarkerdata(res.data);
          } else {
            setSinglemarkerdata(my_random_data);
            console.log("Setting random data");
            /* setSinglemarkerdatanot(singlemarker); */
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log("Single data fetching from server");
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
              <Polyline
                positions={singlemarkerdata}
                pathOptions={{ color: "green" }}
              ></Polyline>
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
