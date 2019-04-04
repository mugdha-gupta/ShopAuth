import {
  Button, Modal, Form, Input, Radio, Tooltip, Icon, 
} from 'antd';
import React, { Component } from "react";
import axios from "axios";

const RadioGroup = Radio.Group;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {

    
    render() {
      const {
        visible, onCancel, onCreate, form,
      } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title="Add a New User"
          okText="Add"
          onCancel={onCancel}
          onOk={onCreate}
        >
                <Form layout="vertical">

        <Form.Item
          label="First Name"
        >
          {getFieldDecorator('firstname', {
            rules: [{ required: true, message: 'Please enter a first name', whitespace: true }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label="Last Name"
        >
          {getFieldDecorator('lastname', {
            rules: [{ required: true, message: 'Please enter a last name', whitespace: true }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label="E-mail"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'Not a valid e-mail address',
            }, {
              required: true, message: 'Please enter an e-mail address',
            }],
          })(
            <Input />
          )}
        </Form.Item>
        
      
        <Form.Item
          label={(
            <span>
              Comet Card ID&nbsp;
              <Tooltip title="Swipe the Comet Card here">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('cardid', {
            rules: [{ required: true, message: 'Please enter a comet card ID', whitespace: true }],
          })(
            <Input.Password />
          )}
        </Form.Item>
        <Form.Item
          label="Admin Level"
        >
          {getFieldDecorator('adminlevel', {initialValue: 0},{rules: [{required: true, message: 'Please choose an admin level'}]})(
            <RadioGroup name="radiogroup">
              <Radio value={0}>Level 0</Radio>
              <Radio value={1}>Level 1</Radio>
              <Radio value={2}>Level 2</Radio>
            </RadioGroup>
          )}
        </Form.Item>
      </Form>
        </Modal>
      );
    }
  }
);

class NewUserButton extends Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      const name = values.firstname + ' ' + values.lastname;
        const email = values.email;
        const cardid = values.cardid;
        const adminlevel = values.adminlevel;
        console.log('Received values of form: ', name, email, cardid, adminlevel);
        axios
        .post("http://localhost:8080/user", {name:name, email:email, admin_level:adminlevel, scanString:cardid})
        .then(u => {
          console.log(u);
          const user = {
            id: u.data.id,
            name: u.data.name,
            email: u.data.email,
            cardid: u.data.scanString,
            admin: u.data.admin_level
          };
          this.props.addUser(user);
        })
        .catch((error) => {
          // Error
          console.log(error);
          alert('error could not post');

      });
      form.resetFields();
      this.setState({ visible: false });
    });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  render() {
    return (
      <span>
        <Button type="primary" icon="user-add" ghost onClick={this.showModal}>Add New User</Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </span>
    );
  }
}

export default NewUserButton;