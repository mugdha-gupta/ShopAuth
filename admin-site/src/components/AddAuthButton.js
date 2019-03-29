import {
  Button, Modal, Form, Transfer
} from 'antd';
import React, { Component } from "react";
import axios from "axios";

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {

    
    render() {
      const {
        visible, onCancel, onCreate, form, user, machineTypes, targetKeys, filterOption, handleChange, handleSearch
      } = this.props;

      var title = "Edit Authorizations of " + user.name
      return (
        <Modal
          visible={visible}
          title={title}
          okText="Save"
          onCancel={onCancel}
          onOk={onCreate}
        >
         <Form layout="vertical">

           <Form.Item
              label="Authorizations"
           >
            <Transfer
                dataSource={machineTypes}
                showSearch
                filterOption={filterOption}
                targetKeys={targetKeys}
                onChange={handleChange}
                onSearch={handleSearch}
                render={item => item.title}
            />
        </Form.Item>

      </Form>
        </Modal>
      );
    }
  }
);

class AddAuthButton extends Component {
  state = {
    visible: false,
    currAuths: [],
    targetAuths: [],
    machineTypes: [],
    targetKeys:[]
  };

  showModal = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleCreate = () => {
  console.log("Target Keys: ")
  console.log(this.state.targetKeys)
    this.state.targetKeys.map(t => {
        if(this.state.currAuths.filter(auth => auth === t).length === 0){
        console.log("Target Key to add: " + t)
            axios
             .post("http://localhost:8080/auth", {typeId:t, userId:this.props.user.id})
             .then(response => {
               console.log('successfully added ' + t);
             })
             .catch((error) => {
                // Error
                console.log(error);
                alert('error could not add ' + t);
             });
        }
    })
    console.log("Curr Auths: ")
    console.log( this.state.currAuths)
    this.state.currAuths.map(auth => {
      if(this.state.targetKeys.filter(key => key === auth).length === 0){
          console.log("{typeId:" + auth.typeId + ", userId:" + this.props.user.id + "}")
          axios
            .delete("http://localhost:8080/auth", {data: {typeId:auth, userId:this.props.user.id}})
            .then(response => {
               console.log('successfully removed ' + auth);
            })
            .catch((error) => {
               // Error
               console.log(error);
                alert('error could not remove ' + auth);
            });
       }
    });
    this.setState({ visible: false, currAuths: this.state.targetKeys });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  componentDidMount() {
    axios
        .get("http://localhost:8080/machinetype")
        .then(response => {

          // create an array of users only with relevant data and init an empty list of auths for each user
          const newMachineTypes = response.data.map(u => {
            return {
              key: u.id,
              title: u.displayname
            };
          });

          // create a new "State" object without mutating
          // the original State object.
          const newState = Object.assign({}, this.state, {
            machineTypes: newMachineTypes
          });

          // store the new state object in the component's state
          this.setState(newState);
        })
        .catch(error => console.log(error));
    axios
        .post("http://localhost:8080/auth/findByUser", {
          id: this.props.user.id
        })
        .then(response => {

          // create an array of users only with relevant data
          const newAuths = response.data.map(u => {
            return u.type.id;
          });


          // create a new "State" object without mutating 
          // the original State object. 
          const newState = Object.assign({}, this.state, {
            currAuths: newAuths,
            targetKeys: newAuths
          });

          // store the new state object in the component's state
          this.setState(newState);
        })
        .catch(error => console.log(error));
  }
  filterOption = (inputValue, option) => option.typeName.indexOf(inputValue) > -1

  handleChange = (targetKeys) => {
      console.log(this.state.targetKeys);
      this.setState({ targetKeys });
      console.log(this.state.targetKeys);
    }

  render() {
    return (
      <span>
        <Button type="primary" icon="safety-certificate" ghost onClick={this.showModal}>Edit Authorizations</Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          user={this.props.user}
          machineTypes={this.state.machineTypes}
          filterOption={this.filterOption}
          handleChange={this.handleChange}
          targetKeys={this.state.targetKeys}
        />
      </span>
    );
  }
}

export default AddAuthButton;