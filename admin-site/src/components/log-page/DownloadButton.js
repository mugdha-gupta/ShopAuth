import React, { Component } from "react";
import axios from "axios";
import { Modal, Button } from 'antd';
import API_ADDRESS from '../../config'

const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');
const confirm = Modal.confirm;

function showConfirm(props) {
  //Bring up confirm box
  confirm({
    okText:"Yes",
    title: 'Download Logs?',
    content: 'Would you like to export the log data as a CSV file?',
    onOk() {
      // If confirmed download the csv
      const csvFromArrayOfObjects = convertArrayToCSV(props, {
        header: ['Machine Name', 'User Name', 'Witness', 'Start Time', 'End Time']
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

  render() {
    return (
      <span>
      <Button type="primary" ghost icon="download" onClick={() => showConfirm(this.props.logs)}>Download</Button>
      </span>
    );
  }
}
 
export default DownloadButton;