import {
  Button, Modal, Form, Input, Radio, Tooltip, Icon, 
} from 'antd';
import React, { Component } from "react";
import axios from "axios";
import API_ADDRESS from '../../config'

const RadioGroup = Radio.Group;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {

    
    render() {
      const {
        visible, onCancel, onCreate, form, user
      } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={user.name}
          okText="Save"
          onCancel={onCancel}
          onOk={onCreate}
        >
                <Form layout="vertical">

        <Form.Item
          label="Name"
        >
          {getFieldDecorator('name', {
            initialValue: user.name,
            rules: [{ required: true, message: 'Please enter a name', whitespace: true }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label="E-mail"
        >
          {getFieldDecorator('email', {
            initialValue: user.email,
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
            initialValue: user.cardid,
            rules: [{ required: true, message: 'Please enter a comet card ID', whitespace: true }],
          })(
            <Input.Password/>
          )}
        </Form.Item>
        <Form.Item
          label="Admin Level"
        >
          {getFieldDecorator('adminlevel', {initialValue: user.admin},{rules: [{required: true, message: 'Please choose an admin level'}]})(
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

class EditUserButton extends Component {
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
    const id = this.formRef.props.user.id;
    // Validate that all needed information is provided in the form
    form.validateFields((err, values) => {
      if (err) {
        // If not all information provided, do nothing
        return;
      }

      // If all information is provided, save the changes in the database
      console.log('Received values of form: ', values);
      const name = values.name;
        const email = values.email;
        const cardid = values.cardid;
        const adminlevel = values.adminlevel;
        console.log('Received values of form: ', name, email, cardid, adminlevel);
        axios
        .put(API_ADDRESS + "/user/"+id, {name:name, email:email, admin_level:adminlevel, scanString:cardid})
        .then(u => {
          const user = {
            id: u.data.id,
            name: u.data.name,
            email: u.data.email,
            cardid: u.data.scanString,
            admin: u.data.admin_level
          };

          // Replace the old user with the edited one on the main page
          this.props.user.delUser(u.data.id, user);

        })
        .catch((error) => {
          // Error
          console.log(error);
          alert('error could not save');

      });

      //Reset the form for next use
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
        <Button type="primary" icon="edit" ghost onClick={this.showModal}>Edit</Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          user={this.props.user}
        />
      </span>
    );
  }
}

export default EditUserButton;