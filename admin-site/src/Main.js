import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import StatusPage from "./components/StatusPage"
import UserPage from "./components/UserPage";
import MachinePage from "./components/MachinePage";
import "antd/dist/antd.css";

 
class Main extends Component {

  render() {
    return (
      <HashRouter>
        <div>
          <h1>Machine Shop Authorization</h1>
          <ul className="header">
            <li><NavLink exact to="/">StatusPage</NavLink></li>
            <li><NavLink to="/users">Users</NavLink></li>
            <li><NavLink to="/machines">Machines</NavLink></li>
          </ul>
          <div className="content">
            <Route exact path="/" component={StatusPage}/>
            <Route path="/users" component={UserPage}/>
            <Route path="/machines" component={MachinePage}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default Main;