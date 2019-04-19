import React, { Component } from "react";
import axios from "axios";
import {Table, AutoComplete, Button} from 'antd';
import DownloadButton from "./DownloadButton"

const columns = [
{
  title: 'Machine Name',
  dataIndex: 'machine',
  sorter: (a, b) => {if(a.machine.toLowerCase() < b.machine.toLowerCase()) return -1;
                     if(a.machine.toLowerCase() >= b.machine.toLowerCase()) return 1;},
}, {
  title: 'Machine Type',
  dataIndex: 'type',
  sorter: (a, b) => {if(a.type.toLowerCase() < b.type.toLowerCase()) return -1;
                     if(a.type.toLowerCase() >= b.type.toLowerCase()) return 1;
    }
}, {
  title: 'User',
  dataIndex: 'user',
  sorter: (a, b) => {if(a.user.toLowerCase() < b.user.toLowerCase()) return -1;
                     if(a.user.toLowerCase() >= b.user.toLowerCase()) return 1;
    }
}, {
  title: 'Start Time',
  dataIndex: 'starttime',
  sorter: (a, b) => {if(a.starttime.toLowerCase() < b.starttime.toLowerCase()) return -1;
                     if(a.starttime.toLowerCase() >= b.starttime.toLowerCase()) return 1;
    }
}, {
  title: 'End Time',
  dataIndex: 'endtime',
  sorter: (a, b) => {if(a.endtime.toLowerCase() < b.endtime.toLowerCase()) return -1;
                     if(a.endtime.toLowerCase() >= b.endtime.toLowerCase()) return 1;
    }
}];


 
class StatusPage extends Component {
  constructor(){
      super()
      this.state = {
        //List of log objects
        logs: [],
        // List of logs after filter
        filteredLogs: [],
        // Autocomplete data
        autocomplete: [],
        // Filtered autocomplete data
        filteredAutoComplete: [],
      }

      this.filterLogs = this.filterLogs.bind(this);
  }



  componentDidMount() {
    axios
      .get("http://localhost:8080/log")
      .then(response => {

        // create an array of logs only with relevant data
        const newLogs = response.data.map(u => {
          let startraw = new Date(u.starttime)
          let sYear = startraw.getFullYear().toString()
          let sMonth = ("0" + startraw.getMonth().toString()).slice(-2);
          let sDate = ("0" + startraw.getDate().toString()).slice(-2);
          let sHours = ("0" + startraw.getHours().toString()).slice(-2);
          let sMinutes = ("0" + startraw.getMinutes().toString()).slice(-2)
          let sSeconds = ("0" + startraw.getSeconds().toString()).slice(-2)
          let startString = sYear+'-'+sMonth+'-'+sDate+' '+sHours+':'+sMinutes+':'+sSeconds
          let endraw = new Date(u.endtime)
          let eYear = endraw.getFullYear().toString()
          let eMonth = ("0" + endraw.getMonth().toString()).slice(-2);
          let eDate = ("0" + endraw.getDate().toString()).slice(-2);
          let eHours = ("0" + endraw.getHours().toString()).slice(-2)
          let eMinutes = ("0" + endraw.getMinutes().toString()).slice(-2)
          let eSeconds = ("0" + endraw.getSeconds().toString()).slice(-2)
          let endString = eYear+'-'+eMonth+'-'+eDate+' '+eHours+':'+eMinutes+':'+eSeconds
          return {
            machine: u.machine.displayname,
            type: u.machine.type.displayname,
            user: u.user.name,
            witness: u.witness,
            starttime: startString,
            endtime: endString
          };
        });

        //Update the autocomplete data
        var newAutocomplete = [];
        newLogs.forEach(function(log) {
          newAutocomplete.push(log.machine);
          newAutocomplete.push(log.user);
        });

        // create a new "State" object without mutating 
        // the original State object. 
        const newState = Object.assign({}, this.state, {
          logs: newLogs,
          filteredLogs: newLogs,
          autocomplete: Array.from(new Set(newAutocomplete)),
          filteredAutoComplete: Array.from(new Set(newAutocomplete))
        });

        // store the new state object in the component's state
        this.setState(newState);
        
      })
      .catch(error => console.log(error));
  }

  filterLogs(value){
    console.log(value)
      // keep only logs with machine name or user name that contains search query
    var fLogs = this.state.logs.filter((log) => {
      let logMachine = log.machine.toLowerCase()
      let logUser = log.user.toLowerCase()
      return logMachine.includes(value.toLowerCase()) || logUser.includes(value.toLowerCase())
    });

    // keep only autocomplete options that contain search query
    var fAuto = this.state.autocomplete.filter((search) => {
      return search.toLowerCase().includes(value.toLowerCase())
    });

    const newState = Object.assign({}, this.state, {
          filteredLogs: fLogs,
          filteredAutoComplete: fAuto
    });
    this.setState(newState);
  }
  

  render() {
    return (
      <div>
      <h2> Logs </h2>
      <DownloadButton />
        <div style={{float: "right"}}>
          <AutoComplete
            dataSource={this.state.filteredAutoComplete}
            placeholder="Search logs"
            onSearch={this.filterLogs}
            onSelect={this.filterLogs}
            style={{ width: 200 }}
          />
        </div>
        <Table 
          dataSource={this.state.filteredLogs} 
          columns={columns} 
        />
      </div>
    );
  }
}
 
export default StatusPage;