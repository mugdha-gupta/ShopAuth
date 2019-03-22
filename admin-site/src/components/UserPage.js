import 'bootstrap/dist/css/bootstrap.min.css'; 
import React, { Component } from "react";
import axios from "axios";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

const { SearchBar } = Search;

const rowStyle = { textAlign: "center" };

// The definition for the colomns in the users table
// datafield is the name of the variable from the object to use to fill the column
// text is the name of the column to be displayed
// sort is whether or not the table can be sorted by this column (sorting occurs when the title of the column is clicked)
const columns = [{
    dataField: 'id',
    text: 'User ID',
    headerStyle: {
    backgroundColor: '#f1f1f1'
  	},
    sort: true
  }, {
    dataField: 'name',
    text: 'User Name',
    headerStyle: {
    backgroundColor: '#f1f1f1'
  	},
    sort: true
  }, {
    dataField: 'email',
    text: 'User Email',
    headerStyle: {
    backgroundColor: '#f1f1f1'
  	},
    sort: true
  }];

// The definition for the colomns in the inner auth tables 
const authColumns = [{
  dataField: 'userId',
  text: 'User ID',
  sort: true
}, {
  dataField: 'typeName',
  text: 'Machine Type Name',
  sort: true
}, {
  dataField: 'typeId',
  text: 'Machine Type Id',
  sort: true
}];

class UsersPage extends Component {
  constructor(){
      super()
      this.state = {
        // List of all users in the system
        users: [],
        // Dictionary that maps a user to all the auths associated to the user
        userAuths: {}
      }
  }
  

  componentDidMount() {
    axios
      .get("http://localhost:8080/user")
      .then(response => {

        // create an array of users only with relevant data and init an empty list of auths for each user
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
    //Call api to get auths for expanded user if the row is expanded and it has not already been retrieved
    if(isExpand && this.state.userAuths[row.id].length === 0){
      console.log("here");
      axios
        .post("http://localhost:8080/auth/findByUser", {
          id: row.id
        })
        .then(response => {

          // create an array of users only with relevant data
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
    //Properties to use when a row is expanded in user table
    const expandRow = {
      //What html to use to render inner auth tables
      renderer: row => (
        // add margin here to indent from outer table
        <div style={{marginLeft: 50}}>
          <ToolkitProvider
            keyField='typeId' 
            data={this.state.userAuths[row.id]} 
            columns={authColumns}
            search
          >
            {
              props => (
                <div>
                  <div style={{float: "right"}}>
                    <SearchBar { ...props.searchProps } 
                      placeholder="Search Authorizations"
                    />
                  </div>
                  <BootstrapTable
                    { ...props.baseProps }
                    bordered={ false }
                  />
                </div>
              )
            }
          </ToolkitProvider>
        </div>
      ),

      //What function to call when a row is expanded
      onExpand: this.handleOnExpand
    };

    // How to render outer user table
    // ToolkitProvider generates all the table stuff
    // data is list of objects to use to fill table
    // columns is the format of the columns defined earlier
    // search tells it there is a SearchBar object that should be used to filter
    // props is how the table stuff should be organized
    return (
      <div>
        <ToolkitProvider 
          keyField='id' 
          data={this.state.users} 
          columns={columns}
          search>
            {
              props => (
                <div style={rowStyle}>
                  <div style={{float: "right"}}>
                    <SearchBar 
                      { ...props.searchProps } 
                      placeholder="Search Users"
                    />
                  </div>
                  <BootstrapTable
                    { ...props.baseProps }
                    expandRow={ expandRow } 
                    bordered={ false }
                  />
                </div>
              )
            }
          </ToolkitProvider>
      </div>
    );
  }
}

   
export default UsersPage;