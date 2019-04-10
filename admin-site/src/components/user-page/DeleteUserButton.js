import {
  Popconfirm, Button
} from 'antd';
import React, { Component } from "react";
import axios from "axios";
import API_ADDRESS from '../../config'

class DeleteUserButton extends Component {
  handleDelete = () => {
    const id = this.props.id;
    axios
      .delete(API_ADDRESS + "/user/"+id)
      .then(response => {
        this.props.delUser(id);
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
      <Popconfirm placement="bottom" title="Are you sure you want to delete this user?" onConfirm={this.handleDelete.bind(this)} okText="Yes" cancelText="No">
        <Button type="primary" icon="delete" ghost onClick={this.showModal}>Delete</Button>
      </Popconfirm>
      </span>
    );
  }
}

export default DeleteUserButton;