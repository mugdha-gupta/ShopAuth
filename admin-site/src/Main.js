import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Status from "./components/Status"
import Stuff from "./Stuff";
import Contact from "./Contact";
import UserPage from "./components/UserPage"

 
class Main extends Component {

  render() {
    return (
      <HashRouter>
        <div>
          <h1>Machine Shop Authorization</h1>
          <ul className="header">
            <li><NavLink exact to="/">Status</NavLink></li>
            <li><NavLink to="/stuff">Stuff</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            <li><NavLink to="/users">Users</NavLink></li>
          </ul>
          <div className="content">
            <Route exact path="/" component={Status}/>
            <Route path="/stuff" component={Stuff}/>
            <Route path="/contact" component={Contact}/> 
            <Route path="/users" component={UserPage}/> 
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default Main;