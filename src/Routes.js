import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Login from "./Components/LoginApp";
import Register from "./Components/RegisterApp";
import Home from "./Components/Home";
import Device from "./Components/Device";
import Account from "./Components/Account";
import NotFound from "./Components/Notfound";

const authGuard = (Component) => () => {
  return localStorage.getItem("token") ? (
    <Component />
  ) : (
    <Redirect to="/login" />
  );
};

function Routes(props) {
  return (
    <Router {...props}>
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/device" render={authGuard(Device)} />
        <Route exact path="/account" render={authGuard(Account)} />
        <Route exact path="/home" render={authGuard(Home)} />
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default Routes;
