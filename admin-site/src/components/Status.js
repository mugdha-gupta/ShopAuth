import 'bootstrap/dist/css/bootstrap.min.css'; 
import React, { Component } from "react";
import axios from "axios";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import refresh from "../assets/refresh.svg"

const { SearchBar } = Search;

const rowStyle = { 
  textAlign: "center",
};

const columns = [{
    dataField: 'machine',
    text: 'Machine Name',
    sort: true
  }, {
    dataField: 'user',
    text: 'User Name',
    sort: true
  }];

class UsersPageCollapsible extends Component {
  constructor(){
      super()
      this.state = {
        logins: [],
        lastRefresh: 0
      }
  }
  

  componentDidMount() {
    axios
      .get("http://localhost:8080/login")
      .then(response => {

        // create an array of logins only with relevant data
        const newLogins = response.data.map(u => {
          return {
            machine: u.machine.displayname,
            user: u.user.name
          };
        });

        // create a new "State" object without mutating 
        // the original State object. 
        var date = new Date();
        const newState = Object.assign({}, this.state, {
          logins: newLogins,
          lastRefresh: date.getTime()
        });

        // store the new state object in the component's state
        this.setState(newState);
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        <ToolkitProvider 
          keyField='machine' 
          data={this.state.logins} 
          columns={columns}
          search>
            {
              props => (
                <div style={ rowStyle }>
                  <SearchBar { ...props.searchProps } 
                    placeholder="Search Logins"
                  />
                  <button><img src={refresh} alt="Refresh" onClick={this.refresh.bind(this)}/></button>
                  <hr />
                  <BootstrapTable
                    { ...props.baseProps }
                    rowStyle={ rowStyle }
                  />
                </div>
              )
            }
          </ToolkitProvider>
      </div>
    );
  }

  refresh() {
    var date = new Date();
    if(this.state.lastRefresh < date.getTime() - 30000){
      axios
      .get("http://localhost:8080/login")
      .then(response => {

        // create an array of logins only with relevant data
        const newLogins = response.data.map(u => {
          return {
            machine: u.machine.displayname,
            user: u.user.name
          };
        });

        // create a new "State" object without mutating 
        // the original State object. 
        const newState = Object.assign({}, this.state, {
          logins: newLogins,
        });

        // store the new state object in the component's state
        this.setState(newState);
      })
      .catch(error => console.log(error));
    }
    else{
    console.log("Too soon");
    }
  }
}

   
export default UsersPageCollapsible;