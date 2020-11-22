import "./Home.css";
import Leafletmap from "./LeafletMap";
import Navbar from "./Navbar";

function Home() {
  return (
    <>
      <div className="row row-cols-1 row-cols-md-2">
        <div className="col-md-3 bg-light">
          <Navbar />
        </div>
        <div className="col-md-9">
          <Leafletmap />
        </div>
      </div>
    </>
  );
}

export default Home;
