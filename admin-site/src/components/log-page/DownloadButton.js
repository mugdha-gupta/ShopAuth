import React, { Component } from "react";
import axios from "axios";
import { Modal, Button } from 'antd';

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');
const confirm = Modal.confirm;

function showConfirm(props) {
  confirm({
    //icon:"file-excel",
    okText:"Yes",
    title: 'Download Logs?',
    content: 'Would you like to export the log data as a CSV file?',
    onOk() {
      const csvFromArrayOfObjects = convertArrayToCSV(props, {
        header: ['Machine Name', 'Machine Type', 'User Name', 'Start Time', 'End Time']
      });
      console.log('results: ', csvFromArrayOfObjects);
      downloadCSV(csvFromArrayOfObjects);
    },
    onCancel() {},
  });
}

function downloadCSV(csv) {
  var data, filename, link;

  filename = 'LogData.csv';

  if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);

  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
}

 
class DownloadButton extends Component {
  constructor(){
    super()
    this.state = {
      //List of log objects
      logs: []
    }
    this.showModal = this.showModal.bind(this);
  }

  showModal(props) {
    confirm({
      okText:"Yes",
      title: 'Download Logs?',
      content: 'Would you like to export the log data as a CSV file?',
      onOk() {
        console.log('results: ', props.this);
      },
      onCancel() {},
    });
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
            starttime: startString,
            endtime: endString
          };
        });

        // create a new "State" object without mutating 
        // the original State object. 
        const newState = Object.assign({}, this.state, {
          logs: newLogs
        });

        // store the new state object in the component's state
        this.setState(newState);
        
      })
      .catch(error => console.log(error));
  }


  render() {
    return (
      <span>
      <Button type="primary" ghost icon="download" onClick={() => showConfirm(this.state.logs)}>Download</Button>
      </span>
    );
  }
}
 
export default DownloadButton;