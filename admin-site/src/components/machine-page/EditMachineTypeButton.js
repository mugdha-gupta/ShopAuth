import {Button, Modal, Form, Input, TimePicker, } from 'antd';
import React, { Component } from "react";
import axios from "axios";
import moment from 'moment';


const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {

    
    render() {
      const {
        visible, onCancel, onCreate, form, type
      } = this.props;
      const { getFieldDecorator } = form;
      function handleChange(time, timeString) {
        console.log(time, 'timeString:' + timeString);
      }
      return (
        <Modal
          visible={visible}
          title={type.typeName}
          okText="Save"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Machine Type Name">
              {getFieldDecorator('name', {
                initialValue: type.typeName,
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

class EditMachineTypeButton extends Component {
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
    const id = this.formRef.props.type.id;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      const typeName = values.name;
      const time = values.maxtime.format('HH:mm:ss');
        console.log('Received values of form: ', typeName, time);
        axios
        .put("http://localhost:8080/machinetype/"+id, {displayname:typeName, time1:time})
        .then(u => {
          const type = {
            id: u.data.id,
            typeName: u.data.displayname,
            time: u.data.time1,
          };
          console.log(type);
          this.props.type.delType(u.data.id, type);

        })
        .catch((error) => {
          // Error
          console.log(error);
          alert('error could not save');

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
        <Button type="primary" icon="edit" ghost onClick={this.showModal}>Edit</Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          type={this.props.type}
        />
      </span>
    );
  }
}

export default EditMachineTypeButton;