import {Button, Modal, Form, Input, Select} from 'antd';
import React, { Component } from "react";
import axios from "axios";
import moment from 'moment';
import API_ADDRESS from '../../config'

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {

    
    render() {
      const {
        visible, onCancel, onCreate, form, machine, types
      } = this.props;
      const { getFieldDecorator } = form;
      function handleChange(time, timeString) {
        console.log(time, 'timeString:' + timeString);
      }
      const title = "Assigning Machine " + machine.machineName
      return (
        <Modal
          visible={visible}
          title={title}
          okText="Save"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Machine Name">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please enter a name for the machine' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label="Type"
            >
              {getFieldDecorator('type', {
                rules: [{ required: true, message: 'Type of Machine' }],
              })(
                <Select
                  showSearch
                  labelInValue
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {types.map(t => <Select.Option key={t.id} value={t.id}>{t.typeName}</Select.Option>)}
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

class AssignNewMachineButton extends Component {
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
    const id = this.formRef.props.machine.machineId;
    const typeId = this.props.machine.typeId;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      const machineName = values.name;
      const newType = values.type.key;
        console.log('Received values of form: ', id, machineName, typeId);
        axios
        .put(API_ADDRESS+"/machine/"+id, {displayname:machineName, type:newType})
        .then(m => {
          const machine = {
            machineId: m.data.id,
            machineName: m.data.displayname,
            typeId: m.data.type.id
          };
          console.log(machine);
          this.props.machine.assignMachine(machine);

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
        <Button size="large" type="primary" icon="link" onClick={this.showModal}>Assign New Machine</Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          machine={this.props.machine}
          types={this.props.types}
        />
      </span>
    );
  }
}

export default AssignNewMachineButton;