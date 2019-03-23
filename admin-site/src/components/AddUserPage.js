import React, { Component } from "react";
import axios from "axios";
import {Form, Input, Radio, Tooltip, Icon, Button,} from 'antd';


const RadioGroup = Radio.Group;

class RegistrationForm extends Component {
  state = {
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        
        const name = values.firstname + ' ' + values.lastname;
        const email = values.email;
        const cardid = values.cardid;
        const adminlevel = values.adminlevel;
        console.log('Received values of form: ', name, email, cardid, adminlevel);
        axios
        .post("http://localhost:8080/user", {name:name, email:email, admin_level:adminlevel, scanString:cardid})
        .then(response => {
          alert('success');
          
        })
        .catch((error) => {
          // Error
          console.log(error);
          alert('error could not post');

        });

      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 4,
        },
      },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>

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
            <Input />
          )}
        </Form.Item>
        <Form.Item
          label="Admin Level"
        >
          {getFieldDecorator('adminlevel', {initialValue: 1},{rules: [{required: true, message: 'Please choose an admin level'}]})(
            <RadioGroup name="radiogroup">
              <Radio value={1}>Level 1</Radio>
              <Radio value={2}>Level 2</Radio>
              <Radio value={3}>Level 3</Radio>
            </RadioGroup>
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form.Item>
      </Form>
    );
  }
}

const AddUserPage = Form.create({ name: 'register' })(RegistrationForm);

export default AddUserPage;