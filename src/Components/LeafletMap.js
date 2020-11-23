import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState } from "react";
/* import axios from "axios";
import config from "./../config";

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
  })
  .catch(function (error) {
    console.log(error);
  });
 */

let my_server_data = [
  {
    fleetName: "ABC",
    fleetIMEINumber: "123457046934352",
    PhoneNumber: "9866316116",
    fleetModel: "Ford",
    longitude: "27.6664",
    latitude: "85.4904",
  },
  {
    fleetName: "ABC2",
    fleetIMEINumber: "303030303030303",
    PhoneNumber: "98663161167",
    fleetModel: "Fordd",
    longitude: "27.7664",
    latitude: "85.4904",
  },
];

function convertIMEI(strr) {
  var n = "02" + strr.slice(5);
  console.log(n);
  return n;
}

function LeafletMap() {
  const [markings, setMarkings] = useState(my_server_data);
  let center_position = [27.6664, 85.2904];
  console.log(markings);

  const socket = new WebSocket("ws://167.71.225.146:3000");

  // Connection opened
  socket.addEventListener("open", function (event) {
    markings.forEach((mark) => {
      socket.send(
        JSON.stringify({
          action: "subscribe",
          topic: convertIMEI(mark.fleetIMEINumber),
        })
      );
      console.log(socket.readyState);
    });
  });

  // Listen for messages
  socket.addEventListener("message", function (event) {
    var json_response = JSON.parse(event.data);
    console.log(json_response);
    /* markings.forEach(mark => {
      if (convertIMEI(mark.fleetIMEINumber) === json_response.deviceID ) {
        setMarkings({

        })
      }
    }); */
  });

  return (
    <>
      <div id="map">
        <MapContainer center={center_position} zoom={16} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markings.map((mark, index) => (
            <Marker
              position={[mark.longitude, mark.latitude]}
              key={mark.fleetName}
            >
              <Popup>{mark.fleetIMEINumber}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}

export default LeafletMap;
