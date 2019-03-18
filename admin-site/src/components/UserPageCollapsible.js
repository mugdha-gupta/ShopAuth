import 'bootstrap/dist/css/bootstrap.min.css'; 
import React, { Component } from "react";
import axios from "axios";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

const columns = [{
    dataField: 'id',
    text: 'User ID',
    sort: true
  }, {
    dataField: 'name',
    text: 'User Name',
    filter: textFilter({placeholder: 'Search by Name'}),
    sort: true
  }, {
    dataField: 'email',
    text: 'User Email',
    filter: textFilter({placeholder: 'Search by Email'}),
    sort: true
  }];

  const authColumns = [{
    dataField: 'userId',
    text: 'User ID',
    sort: true
  }, {
    dataField: 'typeName',
    text: 'Machine Type Name',
    filter: textFilter({placeholder: 'Search by Type Name'}),
    sort: true
  }, {
    dataField: 'typeId',
    text: 'Machine Type Id',
    filter: textFilter({placeholder: 'Search by Type Id'}),
    sort: true
  }];

class UsersPageCollapsible extends Component {
  constructor(){
      super()
      this.state = {
        users: [],
        userAuths: {}
      }
  }
  

  componentDidMount() {
    axios
      .get("http://localhost:8080/user")
      .then(response => {

        // create an array of contacts only with relevant data
        var newUserAuths = {};
        const newUsers = response.data.map(u => {
          newUserAuths[u.id] = [];
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
          userAuths: newUserAuths
        });

        // store the new state object in the component's state
        this.setState(newState);
      })
      .catch(error => console.log(error));
  }

  handleOnExpand = (row, isExpand, rowIndex, e) => {
    if(isExpand){
      axios
        .post("http://localhost:8080/auth/findByUser", {
          id: row.id
        })
        .then(response => {

          // create an array of contacts only with relevant data
          const newAuths = response.data.map(u => {
            return {
              userId: u.user.id,
              typeName: u.type.displayname,
              typeId: u.type.id
            };
          });

          var newUserAuths = this.state.userAuths;
          newUserAuths[row.id] = newAuths;

          // create a new "State" object without mutating 
          // the original State object. 
          const newState = Object.assign({}, this.state, {
            userAuths: newUserAuths
          });
          // store the new state object in the component's state
          this.setState(newState);
        })
        .catch(error => console.log(error));
      }
  }

  render() {
    const expandRow = {
        renderer: row => (
          <div>
            <BootstrapTable 
              keyField='id' 
              data={this.state.userAuths[row.id]} 
              columns={authColumns}
              filter={filterFactory()}
              expandRow={ expandRow } />
          </div>
        ),
        onExpand: this.handleOnExpand
      };
    return (
      <div>
        <h2>USERS</h2>
        <BootstrapTable 
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