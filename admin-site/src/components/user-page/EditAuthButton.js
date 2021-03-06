import {
  Button, Modal, Form, Transfer
} from 'antd';
import React, { Component } from "react";
import axios from "axios";
import API_ADDRESS from '../../config'

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {    
    render() {
      const {
        visible, onCancel, onCreate, form, user, machineTypes, targetKeys, filterOption, handleChange
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
                render={item => item.title}
            />
        </Form.Item>

      </Form>
        </Modal>
      );
    }
  }
);

class EditAuthButton extends Component {
  state = {
    visible: false,
    currAuths: [],
    targetAuths: [],
    machineTypes: [],
    targetKeys:[]
  };

  // Display form
  showModal = () => {
    this.setState({ visible: true });
  }

  // Hide form on cancel
  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleCreate = () => {
    // If confirmed, edit the auths of the user to match those chosen
    console.log("Target Keys: ")
    console.log(this.state.targetKeys)
    var targetMachineTypes = [];
    const userId = this.props.user.id;
    // For each type chosen, if not already authorized, add that auth to the user
    this.state.targetKeys.map(t => {
        if(this.state.currAuths.filter(auth => auth === t).length === 0){
          console.log("Target Key to add: " + t)
            axios
             .post(API_ADDRESS + "/auth", {typeId:t, userId:userId})
             .then(response => {
               console.log('successfully added ' + t);
             })
             .catch((error) => {
                // Error
                console.log(error);
                alert('error could not add ' + t);
             });
        }
        this.state.machineTypes.filter(type => type.key === t).forEach(function(aprovedType) {
          var newType = {
            userId: userId,
            typeName: aprovedType.title,
            typeId: aprovedType.key
          };
          targetMachineTypes.push(newType);
        })
    })
    console.log("Curr Auths: ")
    console.log( this.state.currAuths)
    // For each type that the user was authorized for, if not still chosen, remove that auth from the user
    this.state.currAuths.map(auth => {
      if(this.state.targetKeys.filter(key => key === auth).length === 0){
          console.log("{typeId:" + auth.typeId + ", userId:" + userId + "}")
          axios
            .delete(API_ADDRESS + "/auth", {data: {typeId:auth, userId:userId}})
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
    // Update the auths displayed on the main page
    this.props.user.updateAuths(userId, targetMachineTypes);
    console.log(targetMachineTypes);
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  componentDidMount() {
    axios
    .get(API_ADDRESS + "/machinetype")
    .then(response => {

      // Create an array of machine types
      const allTypes = response.data.map(u => {
        return {
          key: u.id,
          title: u.displayname
        };
      });

      // Remove unassigned type from options
      const newMachineTypes = allTypes.filter((machinetype) => {
        let typeName = machinetype.title.toLowerCase()
        return !typeName.includes("unassigned")
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
    .post(API_ADDRESS + "/auth/findByUser", {
      id: this.props.user.id
    })
    .then(response => {

      // Get the current set of auths for the user being modified
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

  // Return boolean that says if an option should be included 
  filterOption = (inputValue, option) => option.title.toLowerCase().includes(inputValue.toLowerCase())

  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
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

export default EditAuthButton;