import React, { Component } from "react";
import { Switch } from 'antd';
import axios from "axios";

function onChange(checked) {
  const adminpresent = checked;
  axios
    .post("http://localhost:8080/login/setadmin", {adminPresent:adminpresent})
    .then(response => {
      console.log('success');
    })
    .catch((error) => {
      // Error
      console.log(error);
    });
}
 
class AdminModeSwitch extends Component {
  render() {
    return (
      <Switch defaultChecked onChange={onChange} checkedChildren="IN" unCheckedChildren="OUT" />

      
    );
  }
}

export default AdminModeSwitch;