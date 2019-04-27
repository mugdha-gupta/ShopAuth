import {
  Button, Modal, Form, Input, TimePicker
} from 'antd';
import React, { Component } from "react";
import axios from "axios";
import moment from 'moment';
import API_ADDRESS from '../../config'

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {

    
    render() {
      const {
        visible, onCancel, onCreate, form,
      } = this.props;
      const { getFieldDecorator } = form;

      function handleChange(time, timeString) {
        console.log(time, 'timeString:' + timeString);
      }
      return (
        <Modal
          visible={visible}
          title="Create a New Machine Type"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Machine Type Name">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please enter a name for the machine type' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="Max Use Time">
              {getFieldDecorator('maxtime', {
                initialValue: moment('01:00:00', 'HH:mm:ss'),
                rules: [{ required: true, message: 'Please enter a max use time for the machine type' }],
              })(<TimePicker onChange={handleChange} />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

class NewMachineTypeButton extends Component {
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
      const name = values.name;
      const time = values.maxtime.format('HH:mm:ss');

      axios
        .post(API_ADDRESS + "/machinetype", {displayname:name, time1:time})
        .then(u => {
          alert('success');
          const type = {
            id: u.data.id,
            typeName: u.data.displayname,
            time: u.data.time1,
          };

          //Add the new type to those displayed on the page
          this.props.addType(type);
          
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
        <Button type="primary" icon="plus" ghost onClick={this.showModal}>Add New Machine Type</Button>
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

export default NewMachineTypeButton;