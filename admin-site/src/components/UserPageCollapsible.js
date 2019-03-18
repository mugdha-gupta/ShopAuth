import 'bootstrap/dist/css/bootstrap.min.css'; 
import React, { Component } from "react";
import axios from "axios";
import UserListCollapsible from "./UserListCollapsible";
import Collapsible from 'react-collapsible';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

const columns = [{
    dataField: 'id',
    text: 'User ID',
    sort: true
  }, {
    dataField: 'name',
    text: 'User Name',
    filter: textFilter(),
    sort: true
  }, {
    dataField: 'email',
    text: 'User Email',
    filter: textFilter(),
    sort: true
  }];

  const expandRow = {
  renderer: row => (
    <div>
      <p>{ 'This Expand row is belong to rowKey {row.id}' }</p>
      <p>You can render anything here, also you can add additional data on every row object</p>
      <p>expandRow.renderer callback will pass the origin row object to you</p>
    </div>
  )
};

class UsersPageCollapsible extends Component {
  constructor(){
      super()
      this.state = {
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
    return (
      
      <div>
        <h2>USERS</h2>
        <BootstrapTable 
          striped
          hover
          keyField='id' 
          data={this.state.users} 
          columns={columns}
          filter={filterFactory()}
          expandRow={ expandRow } />
      </div>


    );
  }
}
   
export default UsersPageCollapsible;