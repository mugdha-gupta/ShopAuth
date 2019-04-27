import {Popconfirm, Button} from 'antd';
import React, { Component } from "react";
import axios from "axios";
import API_ADDRESS from '../../config'

class DeleteMachineTypeButton extends Component {
  // On confirm, delete the type
  handleDelete = () => {
    const id = this.props.id;
    axios
      .delete(API_ADDRESS + "/machinetype/"+id)
      .then(response => {
        // Remove this type from being displayed on the main page
        this.props.delType(id);
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
      <Popconfirm placement="bottom" title="Are you sure you want to delete this machine type?" onConfirm={this.handleDelete.bind(this)} okText="Yes" cancelText="No">
        <Button type="primary" icon="delete" ghost onClick={this.showModal}>Delete</Button>
      </Popconfirm>
      </span>
    );
  }
}

export default DeleteMachineTypeButton;
