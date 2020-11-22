function Navbar() {
  return (
    <>
      <div className="row my-bg py-2 text-light">
        <h4 className="text-center">Fleet Tracker</h4>
      </div>
      <div className="row pt-3 px-5">
        <h5 className="text-center font-weight-bold">Company Name</h5>
      </div>
      <div className="row py-2 px-5 mb-5">
        <button className="btn btn-outline-danger">Logout</button>
      </div>
      <div className="row my-bg py-2 text-light border border-bottom-1">
        <h4 className="px-5">Dashboard</h4>
      </div>
      <div className="row my-bg py-2 text-light border border-bottom-1">
        <h4 className="px-5">Add Device</h4>
      </div>
      <div className="row my-bg py-2 text-light border border-bottom-1">
        <h4 className="px-5">Reports</h4>
      </div>
      <div className="row my-bg py-2 text-light border border-bottom-1">
        <h4 className="px-5">Settings</h4>
      </div>
    </>
  );
}

export default Navbar;
