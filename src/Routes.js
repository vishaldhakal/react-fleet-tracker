import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Login from "./Components/LoginApp";
import Home from "./Components/Home";
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
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/myhome">
          <Home />
        </Route>
        <Route path="/home" render={authGuard(Home)} />
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
