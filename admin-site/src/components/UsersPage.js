import React, { Component } from "react";
import axios from "axios";
import UserList from "./UserList";

class UsersPage extends Component {

  state = {
    users: []
  };

  

  componentDidMount() {
    axios
      .get("http://localhost:8080/user")
      .then(response => {

        // create an array of contacts only with relevant data
        const newUsers = response.data.map(u => {
          return {
            id: u.id,
            name: u.name,
            email: u.email
          };
        });

        // create a new "State" object without mutating 
        // the original State object. 
        const newState = Object.assign({}, this.state, {
          users: newUsers
        });

        // store the new state object in the component's state
        this.setState(newState);
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        <h2>USERS</h2>
        <p>here are the users</p>
        <UserList usersarray={this.state.users} />
      </div>


    );
  }
}
 
export default UsersPage;