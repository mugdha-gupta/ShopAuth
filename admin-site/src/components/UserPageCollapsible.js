import React, { Component } from "react";
import "./UserPageCollapsible.css";
import axios from "axios";
import UserListCollapsible from "./UserListCollapsible";
import Collapsible from 'react-collapsible';

class UsersPageCollapsible extends Component {
  constructor(){
      super()
      this.state = {
        input: "",
        users: [],
      }
  }
  


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
          users: newUsers,
          filteredUsers: newUsers
        });

        // store the new state object in the component's state
        this.setState(newState);
      })
      .catch(error => console.log(error));
  }

  render() {

    var fUsers = this.state.users.filter((user) => {
        let userName = user.name.toLowerCase()
        return userName.includes(this.state.input.toLowerCase())
      });

    return (
      

      <div>
        <h2>USERS</h2>
        <input type={this.state.input} id="myInput" onChange={this.myFunction.bind(this)} placeholder="Search for names.."/>
                
        <UserListCollapsible usersarray={fUsers}/>

      </div>


    );
  }

  myFunction(event){
      this.setState({
        input : event.target.value
      })

    }


  }





   
export default UsersPageCollapsible;