import 'bootstrap/dist/css/bootstrap.min.css'; 
import React, { Component } from "react";
import axios from "axios";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import refresh from "../assets/refresh.svg"

const { SearchBar } = Search;

const rowStyle = { 
  textAlign: "center"
};

// The definition for the colomns in the login table 
// datafield is the name of the variable from the object to use to fill the column
// text is the name of the column to be displayed
// sort is whether or not the table can be sorted by this column (sorting occurs when the title of the column is clicked)
const columns = [{
    dataField: 'machine',
    text: 'Machine Name',
    sort: true
  }, {
    dataField: 'user',
    text: 'User Name',
    sort: true
  }
];

// Min time between refreshes to limit api calls in miliseconds
const timeBetweenRefresh = 30 * 1000;

class StatusPage extends Component {
  constructor(){
      super()
      this.state = {
        //List of login objects
        logins: [],
        //Last time status was updated in miliseconds since 1970 
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
          //Set last refresh time to current time
          lastRefresh: date.getTime()
        });

        // store the new state object in the component's state
        this.setState(newState);
      })
      .catch(error => console.log(error));
  }

  // How to render login table
  // ToolkitProvider generates all the table stuff
  // data is list of objects to use to fill table
  // columns is the format of the columns defined earlier
  // search tells it there is a SearchBar object that should be used to filter
  // props is how the table stuff should be organized

  //display and flex direction are used to make items in div align left to right
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
                  <div style={{ display: "flex", flexDirection: "row", float: "right"}}>
                    <SearchBar { ...props.searchProps } 
                      placeholder="Search Logins"
                      style={{float: "left"}}
                    />
                    <button style={{float: "right"}}><img src={refresh} alt="Refresh" onClick={this.refresh.bind(this)}/></button>
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
    );
  }

  refresh() {
    var date = new Date();
    //Refresh status if it has been set time since last refresh
    if(this.state.lastRefresh < date.getTime() - timeBetweenRefresh){
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
          //Set last refresh time to current time
          lastRefresh: date.getTime()
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

   
export default StatusPage;