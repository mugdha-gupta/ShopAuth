import {
  Popconfirm, message, Button, Icon
} from 'antd';
import React, { Component } from "react";
import axios from "axios";

class DeleteUserButton extends Component {
  handleDelete = () => {
    const id = this.props.id;
    axios
      .delete("http://localhost:8080/user/"+id)
      .then(response => {
        alert('success');
          
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