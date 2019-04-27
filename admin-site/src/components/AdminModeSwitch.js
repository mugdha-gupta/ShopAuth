import React, { Component } from "react";
import { Switch } from 'antd';
import axios from "axios";
import API_ADDRESS from '../config'


 
class AdminModeSwitch extends Component {
  constructor(){
    super()
      this.state = {
        adminpresent: false,
      }

      this.onChange = this.onChange.bind(this);
  }


  componentDidMount() {
    //Load the current status of the admin boolean
    axios
    .post(API_ADDRESS + "/login/getadmin")
    .then(response => {
      console.log(response)
      const newadminpresent = response.data.adminPresent
      console.log(newadminpresent)
      const newState = Object.assign({}, this.state, {
          adminpresent: newadminpresent
        });

      this.setState(newState);
      

    })
    .catch((error) => {
      console.log(error);
    });

  }

  onChange(checked) {
    //Set admin mode to the new value of the switch onChange
    const adminpresent = checked;
    axios
    .post(API_ADDRESS + "/login/setadmin", {adminPresent:adminpresent})
    .then(response => {
      console.log('success');
      const newState = Object.assign({}, this.state, {
        adminpresent: response.data.adminPresent
      });

      this.setState(newState);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    console.log(this.state.adminpresent)
    return (
      <Switch checked={this.state.adminpresent} onChange={this.onChange} checkedChildren="IN" unCheckedChildren="OUT" />

    );
  }
}

export default AdminModeSwitch;