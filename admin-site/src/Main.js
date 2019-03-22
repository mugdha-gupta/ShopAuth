import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import StatusPage from "./components/StatusPage"
import Stuff from "./Stuff";
import AddUserPage from "./components/AddUserPage";
import UserPage from "./components/UserPage";

 
class Main extends Component {

  render() {
    return (
      <HashRouter>
        <div>
          <h1>Machine Shop Authorization</h1>
          <ul className="header">
            <li><NavLink exact to="/">StatusPage</NavLink></li>
            <li><NavLink to="/stuff">Stuff</NavLink></li>
            <li><NavLink to="/adduser">Add User</NavLink></li>
            <li><NavLink to="/users">Users</NavLink></li>
          </ul>
          <div className="content">
            <Route exact path="/" component={StatusPage}/>
            <Route path="/stuff" component={Stuff}/>
            <Route path="/adduser" component={AddUserPage}/> 
            <Route path="/users" component={UserPage}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default Main;