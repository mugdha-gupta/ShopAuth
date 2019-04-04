import React, { Component } from "react";
import axios from "axios";
import {Table, AutoComplete} from 'antd';

const columns = [
{
  title: 'Machine',
  dataIndex: 'machine',
  sorter: (a, b) => {if(a.machine.toLowerCase() < b.machine.toLowerCase()) return -1;
                     if(a.machine.toLowerCase() >= b.machine.toLowerCase()) return 1;},
}, {
  title: 'User',
  dataIndex: 'user',
  sorter: (a, b) => {if(a.user.toLowerCase() < b.user.toLowerCase()) return -1;
                     if(a.user.toLowerCase() >= b.user.toLowerCase()) return 1;
    }
}];
 
class StatusPage extends Component {
  constructor(){
      super()
      this.state = {
        //List of login objects
        logins: [],
        // List of logins after filter
        filteredLogins: [],
        // Autocomplete data
        autocomplete: [],
        // Filtered autocomplete data
        filteredAutoComplete: [],
      }

      this.filterLogins = this.filterLogins.bind(this);
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

        //Update the autocomplete data
        var newAutocomplete = [];
        newLogins.forEach(function(login) {
          newAutocomplete.push(login.machine);
          newAutocomplete.push(login.user);
        });

        // create a new "State" object without mutating 
        // the original State object. 
        const newState = Object.assign({}, this.state, {
          logins: newLogins,
          filteredLogins: newLogins,
          autocomplete: Array.from(new Set(newAutocomplete)),
          filteredAutoComplete: Array.from(new Set(newAutocomplete))
        });

        // store the new state object in the component's state
        this.setState(newState);
      })
      .catch(error => console.log(error));
  }

  filterLogins(value){
    console.log(value)
      // keep only logins with machine name or user name that contains search query
      var fLogins = this.state.logins.filter((login) => {
        let loginMachine = login.machine.toLowerCase()
        let loginUser = login.user.toLowerCase()
        return loginMachine.includes(value.toLowerCase()) || loginUser.includes(value.toLowerCase())
      });

      // keep only autocomplete options that contain search query
      var fAuto = this.state.autocomplete.filter((search) => {
        return search.toLowerCase().includes(value.toLowerCase())
      });

      const newState = Object.assign({}, this.state, {
            filteredLogins: fLogins,
            filteredAutoComplete: fAuto
      });
      this.setState(newState);
    }

  render() {
    return (
      <div>
      <h2> Current Status </h2>
        <div style={{float: "right"}}>
          <AutoComplete
            dataSource={this.state.filteredAutoComplete}
            placeholder="Search logins"
            onSearch={this.filterLogins}
            onSelect={this.filterLogins}
            style={{ width: 200 }}
          />
        </div>
        <Table 
          rowKey="user" 
          dataSource={this.state.filteredLogins} 
          columns={columns} 
          expandedRowRender={this.expandRow}
        />
      </div>
    );
  }
}
 
export default StatusPage;