import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function LeafletMap() {
  let center_position = [27.6664, 85.2904];

  const socket = new WebSocket("ws://167.71.225.146:3000");

  // Connection opened
  socket.addEventListener("open", function (event) {
    socket.send(JSON.stringify({ action: "subscribe", topic: "027046934352" }));
    console.log(socket.readyState);
  });

  // Listen for messages
  socket.addEventListener("message", function (event) {
    var json_response = JSON.parse(event.data);
    console.log(json_response);
  });

  return (
    <>
      <div id="map">
        <MapContainer center={center_position} zoom={16} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center_position}>
            <Popup>Vehicle Name</Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  );
}

export default LeafletMap;
