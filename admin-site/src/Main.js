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
import UserPage2 from "./components/UserPage2";
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
            <li><NavLink to="/stuff">Stuff</NavLink></li>
            <li><NavLink to="/adduser">Add User</NavLink></li>
            <li><NavLink to="/users">Users</NavLink></li>
            <li><NavLink to="/users2">Users2</NavLink></li>
            <li><NavLink to="/machines">Machines</NavLink></li>
          </ul>
          <div className="content">
            <Route exact path="/" component={StatusPage}/>
            <Route path="/stuff" component={Stuff}/>
            <Route path="/adduser" component={AddUserPage}/> 
            <Route path="/users" component={UserPage}/>
            <Route path="/users2" component={UserPage2}/>
            <Route path="/machines" component={MachinePage}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default Main;