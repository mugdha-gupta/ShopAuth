import React, { Component } from "react";
import axios from "axios";
import {Table, List, Input, Button} from 'antd';

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

class UserPage2 extends Component {
  constructor(){
      super()
      this.state = {
        // List of all users in the system
        users: [],
        // Dictionary that maps a user to all the auths associated to the user
        userAuths: {},
        sortedInfo: null,
      }
      this.routeChange = this.routeChange.bind(this);
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

  routeChange(e){
    let path = '/adduser';
    this.props.history.push(path);
  }

  render() {
    return (
      <div>
        <span id="heading">
          <h3>Authorized Users </h3>
          <Button type="primary"  icon="user-add" ghost onClick={this.routeChange}>Add User</Button>
        </span>
        <div style={{float: "right"}}>
          <Search
          placeholder="input search text"
          onSearch={value => console.log(value)}
          style={{ width: 200 }}
          //enterButton
          />
        </div>
        <Table rowKey="id" dataSource={this.state.users} columns={columns} 
        expandedRowRender={record => 
          <List
            header={<div style={{fontWeight: "bold"}}> Authorized Machines</div>}
            dataSource={data}
            renderItem={item => (<List.Item>- {item}</List.Item>)}
        />

        }/>
      </div>
    );
  }
}
 
export default UserPage2;