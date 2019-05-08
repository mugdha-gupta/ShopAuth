import {Popconfirm, Button} from 'antd';
import React, { Component } from "react";
import axios from "axios";
import API_ADDRESS from '../../config'

class DeleteMachineButton extends Component {
  handleDelete = () => {
    // If confirmed, delete the machine
    const id = this.props.machine.machineId;
    const type = this.props.machine.typeId;
    axios
      .delete(API_ADDRESS+"/machine/"+id)
      .then(response => {
        // Remove machine from being displayed in the main page
        this.props.machine.delMachine(type, id);
      })
      .catch((error) => {
        // Error
        console.log(error);
        alert('error could not delete');
      });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  
  render() {
    return (
      <span>
      <Popconfirm placement="bottom" title="Are you sure you want to delete this machine?" onConfirm={this.handleDelete.bind(this)} okText="Yes" cancelText="No">
        <Button type="primary" icon="delete" ghost onClick={this.showModal}>Delete</Button>
      </Popconfirm>
      </span>
    );
  }
}

export default DeleteMachineButton;
