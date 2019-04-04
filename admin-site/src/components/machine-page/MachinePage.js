import React, { Component } from "react";
import { List, Card, } from 'antd';
import axios from "axios";
import NewMachineTypeButton from "./NewMachineTypeButton";

 
class MachinePage extends Component {

  constructor(){
      super()
      this.state = {
        // List of all users in the system
        machinetypes: [],
      }
  }

  componentDidMount() {
    axios
      .get("http://localhost:8080/machinetype")
      .then(response => {

        // create an array of logins only with relevant data
        const newMachineTypes = response.data.map(u => {
          return {
            machine: u.displayname,
            id: u.id
          };
        });

        const newState = Object.assign({}, this.state, {
          machinetypes: newMachineTypes,
        });

        // store the new state object in the component's state
        this.setState(newState);
      })
      .catch(error => console.log(error));
  }



  render() {
    return (

      <div>
      <h3>Machine Types</h3>
      <NewMachineTypeButton />
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={this.state.machinetypes}
        renderItem={item => (
          <List.Item>
            <Card title={item.machine}>Card content</Card>
          </List.Item>
        )}
      />
      </div>
      
    );
  }
}
 
export default MachinePage;