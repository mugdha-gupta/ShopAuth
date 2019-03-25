import React, { Component } from "react";
import axios from "axios";
import {Table, List, Input, Button, Icon} from 'antd';
import NewUserButton from './NewUserButton'

const columns = [{
  title: 'User ID',
  dataIndex: 'id',
  sorter: (a, b) => a.id - b.id,
}, {
  title: 'Name',
  dataIndex: 'name',
  sorter: (a, b) => {if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                     if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;},
}, {
  title: 'Email',
  dataIndex: 'email',
   sorter: (a, b) => {if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                     if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;},
}];

const data = [
  'Saw',
  'Lathe',
  'Planer',
  'Drill',
];

const Search = Input.Search;

class UserPage extends Component {
  constructor(){
      super()
      this.state = {
        // List of all users in the system
        users: [],
        // Dictionary that maps a user to all the auths associated to the user
        userAuths: {},
        //List of auths obtained
        obtainedAuths: [],
        sortedInfo: null,
      }

      this.expandIcon = this.expandIcon.bind(this);
  }

  componentDidMount() {
    axios
      .get("http://localhost:8080/user")
      .then(response => {

        // create an array of users only with relevant data and init an empty list of auths for each user
        var newUserAuths = {};
        const newUsers = response.data.map(u => {
          newUserAuths[u.id] = [];
          return {
            id: u.id,
            name: u.name,
            email: u.email,
          };
        });
      
        // create a new "State" object without mutating 
        // the original State object. 
        const newState = Object.assign({}, this.state, {
          users: newUsers,
          userAuths: newUserAuths
        });

        // store the new state object in the component's state
        this.setState(newState);
      })
      .catch(error => console.log(error));
  }

  expandIcon = (record)  => {

    //Call api to get auths for expanded user if the row is expanded and it has not already been retrieved
    if(!this.state.obtainedAuths.includes(record.name)){
      axios
        .post("http://localhost:8080/auth/findByUser", {
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

          var newUserAuths = this.state.userAuths;
          newUserAuths[record.id] = newAuths;

          // Add user to list of users where auths were obtained to avoid repeat retrievals
          var newObtainedAuths = this.state.obtainedAuths;
          newObtainedAuths.push(record.name);

          // create a new "State" object without mutating 
          // the original State object. 
          const newState = Object.assign({}, this.state, {
            userAuths: newUserAuths,
            obtainedAuths: newObtainedAuths
          });

          // store the new state object in the component's state
          this.setState(newState);
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

  render() {
    return (
      <div>
        <span id="heading">
          <h3>Authorized Users </h3>
          <NewUserButton />
        </span>
        <div style={{float: "right"}}>
          <Search
          placeholder="Search users"
          onSearch={value => console.log(value)}
          style={{ width: 200 }}
          //enterButton
          />
        </div>
        <Table 
          rowKey="id" 
          dataSource={this.state.users} 
          columns={columns} 
          expandedRowRender={this.expandIcon}
        />
      </div>
    );
  }
}
 
export default UserPage;