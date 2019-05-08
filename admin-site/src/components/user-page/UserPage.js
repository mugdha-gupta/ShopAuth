import React, { Component } from "react";
import axios from "axios";
import {Table, List, Divider, AutoComplete} from 'antd';
import NewUserButton from './NewUserButton'
import EditUserButton from './EditUserButton'
import DeleteUserButton from './DeleteUserButton'
import EditAuthButton from './EditAuthButton'
import API_ADDRESS from '../../config'


const columns = [
{
  title: 'Name',
  dataIndex: 'name',
  sorter: (a, b) => {if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                     if(a.name.toLowerCase() >= b.name.toLowerCase()) return 1;},
}, {
  title: 'Email',
  dataIndex: 'email',
   sorter: (a, b) => {if(a.email.toLowerCase() < b.email.toLowerCase()) return -1;
                     if(a.email.toLowerCase() >= b.email.toLowerCase()) return 1;
    }
}, {
  title: 'Admin Level',
  dataIndex: 'admin',
   sorter: (a, b) => {if(a.admin < b.admin) return -1;
                     if(a.admin >= b.admin) return 1;
    }
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => (
    <span>
      <EditUserButton 
        user = {record}
      />
      <Divider type="vertical" />
      <DeleteUserButton 
        id = {record.id}
        delUser = {record.delUser}
      />
      <Divider type="vertical" />
      <EditAuthButton
        user = {record}
      />
    </span>
  ),
}];

class UserPage extends Component {
  constructor(){
      super()
      this.state = {
        // List of all users in the system
        users: [],
        // List of users after filter
        filteredUsers: [],
        // Dictionary that maps a user to all the auths associated to the user
        userAuths: {},
        //List of auths obtained
        obtainedAuths: [],
        // Autocomplete data
        autocomplete: [],
        // Filtered autocomplete data
        filteredAutoComplete: [],
      }

      this.expandRow = this.expandRow.bind(this);
      this.filterUsers = this.filterUsers.bind(this);
      this.addUser = this.addUser.bind(this);
      this.delUser = this.delUser.bind(this);
      this.updateAuths = this.updateAuths.bind(this);
  }

  componentDidMount() {
    axios
      .get(API_ADDRESS + "/user")
      .then(response => {

        // create an array of users only with relevant data and init an empty list of auths for each user
        var newUserAuths = {};
        const newUsers = response.data.map(u => {
          newUserAuths[u.id] = [];
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            cardid: u.scanString,
            admin: u.admin_level,
            // Functions used to interact with the main page from external pages
            delUser: this.delUser,
            updateAuths: this.updateAuths
          };
        });

        //Update the autocomplete data
        var newAutocomplete = [];
        newUsers.forEach(function(user) {
          newAutocomplete.push(user.name);
          newAutocomplete.push(user.email);
        });
      
        // create a new "State" object without mutating 
        // the original State object. 
        const newState = Object.assign({}, this.state, {
          users: newUsers,
          userAuths: newUserAuths,
          filteredUsers: newUsers,
          autocomplete: Array.from(new Set(newAutocomplete)),
          filteredAutoComplete: Array.from(new Set(newAutocomplete))
        });



        // store the new state object in the component's state
        this.setState(newState);
      })
      .catch(error => console.log(error));
  }

  expandRow = (record)  => {

    //Call api to get auths for expanded user if the row is expanded and it has not already been retrieved
    if(!this.state.obtainedAuths.includes(record.id)){
      axios
        .post(API_ADDRESS + "/auth/findByUser", {
          id: record.id
        })
        .then(response => {

          // create an array of users only with relevant data
          const newAuths = response.data.map(u => {
            return {
              userId: u.user.id,
              typeName: u.type.displayname,
              typeId: u.type.id
            };
          });

          this.updateAuths(record.id, newAuths);
        })
        .catch(error => console.log(error));
    }
    return (
      <List
        header={<div style={{fontWeight: "bold"}}> Authorized Machines</div>}
        dataSource={this.state.userAuths[record.id]}
        renderItem={item => (<List.Item>- {item.typeName}</List.Item>)}
      />
    );
  }

  filterUsers(value){
    console.log(value)
      // keep only users with name or email that contains search query
      var fUsers = this.state.users.filter((user) => {
        let userName = user.name.toLowerCase()
        let userEmail = user.email.toLowerCase()
        return userName.includes(value.toLowerCase()) || userEmail.includes(value.toLowerCase())
      });

      // keep only autocomplete options that contain search query
      var fAuto = this.state.autocomplete.filter((search) => {
        return search.toLowerCase().includes(value.toLowerCase())
      });

      const newState = Object.assign({}, this.state, {
            filteredUsers: fUsers,
            filteredAutoComplete: fAuto
      });
      this.setState(newState);
    }
  
  addUser = (u) => {
    const newUser = this.makeUser(u);
    var oldUsers = this.state.users;
    oldUsers.push(newUser);
    this.setState({ users: oldUsers });
  }

  makeUser = (u) => {
    const newUser = {
      id: u.id,
      name: u.name,
      email: u.email,
      cardid: u.cardid,
      admin: u.admin,
      delUser: this.delUser,
      updateAuths: this.updateAuths
    }
    return newUser;
  }

  // Delete or replace the user based on if user is None
  delUser = (id, user) => {
    console.log(id);
    var oldUsers = this.state.users;
    for(var i = 0; i < oldUsers.length; i++) {
        // Find the user in the user list
        if(oldUsers[i].id === id) {
          // If new user is defined than replace
          if(user){
            const newUser = this.makeUser(user);
            oldUsers.splice(i, 1, newUser);
          }
          // Otherwise just delete
          else{
            console.log(oldUsers[i]);
            oldUsers.splice(i, 1);
          }
          break;
        }
    }
    console.log(oldUsers);
    this.setState({ users: oldUsers });
  }

  updateAuths = (id, auths) => {
    var newUserAuths = this.state.userAuths;
    newUserAuths[id] = auths;

    // Add user to list of users where auths were obtained to avoid repeat retrievals
    var newObtainedAuths = this.state.obtainedAuths;
    newObtainedAuths.push(id);

    // create a new "State" object without mutating 
    // the original State object. 
    const newState = Object.assign({}, this.state, {
      userAuths: newUserAuths,
      obtainedAuths: newObtainedAuths
    });

    // store the new state object in the component's state
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <span id="heading">
          <h3>Authorized Users </h3>
          <NewUserButton addUser={this.addUser}/>
        </span>
        <div style={{float: "right"}}>
          <AutoComplete
            dataSource={this.state.filteredAutoComplete}
            placeholder="Search users"
            onSearch={this.filterUsers}
            onSelect={this.filterUsers}
            style={{ width: 200 }}
          />
        </div>
        <Table 
          rowKey="id" 
          dataSource={this.state.filteredUsers} 
          columns={columns} 
          expandedRowRender={this.expandRow}
        />
      </div>
    );
  }
}
 
export default UserPage;