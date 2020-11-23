import "./Home.css";
import Leafletmap from "./LeafletMap";
import Navbar from "./Navbar";

function Home() {
  return (
    <>
      <div className="row no-pad row-cols-1 row-cols-md-2">
        <div className="col-md-2">
          <Navbar />
        </div>
        <div className="col-md-10">
          <Leafletmap />
        </div>
      </div>
    </>
  );
}

export default Home;
