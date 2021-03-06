import React, { Component } from "react";
import axios from "axios";
import {Table, List, Divider, AutoComplete} from 'antd';
import NewMachineTypeButton from './NewMachineTypeButton';
import DeleteMachineTypeButton from './DeleteMachineTypeButton'
import EditMachineTypeButton from './EditMachineTypeButton';

import EditMachineButton from './EditMachineButton';
import DeleteMachineButton from './DeleteMachineButton'
import AssignNewMachineButton from './AssignNewMachineButton'


import API_ADDRESS from '../../config'


const columns = [
{
  title: 'Machine Type',
  dataIndex: 'typeName',
  sorter: (a, b) => {if(a.typeName.toLowerCase() < b.typeName.toLowerCase()) return -1;
                     if(a.typeName.toLowerCase() >= b.typeName.toLowerCase()) return 1;},
}, {
  title: 'Max Use Time',
  dataIndex: 'time',
   sorter: (a, b) => {if(a.time.toLowerCase() < b.time.toLowerCase()) return -1;
                     if(a.time.toLowerCase() >= b.time.toLowerCase()) return 1;
    }
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => (
    <span>
      <EditMachineTypeButton 
        type = {record}
      />
      <Divider type="vertical" />
      <DeleteMachineTypeButton 
        id = {record.id}
        delType = {record.delType}
      />
    </span>
  ),
}];

class MachinePage extends Component {
  constructor(){
      super()
      this.state = {
        // List of all machine types in the system
        types: [],
        // List of machine types after filter
        filteredTypes: [],
        // Dictionary that maps a type to all the machines associated to the type
        machines: {},
        //List of machines obtained
        obtainedMachines: [],
        // Autocomplete data
        autocomplete: [],
        // Filtered autocomplete data
        filteredAutoComplete: [],
        //List of Unassigned machines
        unassigned:[],
      }

      this.expandRow = this.expandRow.bind(this);
      this.filterTypes = this.filterTypes.bind(this);
      this.addType = this.addType.bind(this);
      this.delType = this.delType.bind(this);
      this.delMachine = this.delMachine.bind(this);
      this.editMachine = this.editMachine.bind(this);
  }

  componentDidMount() {
    //Find all unassigned machines and store them in a list
    axios
      .post(API_ADDRESS + "/machine/searchType", {name: "Unassigned"})
      .then(response => {
        const unassignedMachines = response.data.map(m => {
          return {
            machineId: m.id,
            machineName: m.displayname,
            typeId: m.type.id,
            assignMachine: this.assignMachine
          };
        });
        console.log(unassignedMachines);
        this.setState({ unassigned: unassignedMachines });
      })
      .catch(error => console.log(error));
    axios
      .get(API_ADDRESS + "/machinetype")
      .then(response => {

        // create an array of machinetypes
        var newMachines = {};
        const allTypes = response.data.map(t => {
          newMachines[t.id] = [];
          return {
            id: t.id,
            typeName: t.displayname,
            time: t.time1,
            delType: this.delType
          };
        });

        // Remove Unassigned type from types
        const newTypes = allTypes.filter((machinetype) => {
          let typeName = machinetype.typeName.toLowerCase()
          return !typeName.includes("unassigned")
        });

        //Update the autocomplete data
        var newAutocomplete = [];
        newTypes.forEach(function(machinetype) {
          newAutocomplete.push(machinetype.typeName);
        });


      
        // create a new "State" object without mutating 
        // the original State object. 
        const newState = Object.assign({}, this.state, {
          types: newTypes,
          machines: newMachines,
          filteredTypes: newTypes,
          autocomplete: Array.from(new Set(newAutocomplete)),
          filteredAutoComplete: Array.from(new Set(newAutocomplete))
        });



        // store the new state object in the component's state
        this.setState(newState);
      })
      .catch(error => console.log(error));
  }

  expandRow = (record)  => {
    // When row is expanded, load up machines for the type expanded if not already loaded
    if(!this.state.obtainedMachines.includes(record.typeName)){
      axios
        .post(API_ADDRESS + "/machine/filter", {typeId: record.id})
        .then(response => {
          // create an array of users only with relevant data
          const newTypeMachines = response.data.map(m => {
            return {
              machineId: m.id,
              machineName: m.displayname,
              typeId: m.type.id,
              editMachine: this.editMachine,
              delMachine: this.delMachine
            };
          });
          
          var newMachines = this.state.machines;
          newMachines[record.id] = newTypeMachines;
          console.log(newMachines[record.id]);

          // Add user to list of users where auths were obtained to avoid repeat retrievals
          var newObtainedMachines = this.state.obtainedMachines;
          newObtainedMachines.push(record.typeName);

          // create a new "State" object without mutating 
          // the original State object. 
          const newState = Object.assign({}, this.state, {
            machines: newMachines,
            obtainedMachines: newObtainedMachines
          });

          // store the new state object in the component's state
          this.setState(newState);
        })
        .catch(error => console.log(error));
    }

    // Display all machines of a given type
    return(
      <List
        header={<div style={{fontWeight: "bold"}}>Machines</div>}
        dataSource={this.state.machines[record.id]}
        renderItem={item => (<List.Item>- {item.machineName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <EditMachineButton 
            machine = {item}
            types = {this.state.types}
          />
          <Divider type="vertical" />
          <DeleteMachineButton 
            machine = {item}
          />
        </List.Item>)}
      />
    );

  }

  filterTypes(value){
      // keep only users with name or email that contains search query
      var fTypes = this.state.types.filter((machinetype) => {
        let typeName = machinetype.typeName.toLowerCase()
        return typeName.includes(value.toLowerCase())
      });

      // keep only autocomplete options that contain search query
      var fAuto = this.state.autocomplete.filter((search) => {
        return search.toLowerCase().includes(value.toLowerCase())
      });

      const newState = Object.assign({}, this.state, {
            filteredTypes: fTypes,
            filteredAutoComplete: fAuto
      });
      this.setState(newState);
    }
  
  // Add new type to type list when created
  addType = (t) => {
    const newType = this.makeType(t);
    var oldTypes = this.state.types;
    oldTypes.push(newType);
    this.setState({ types: oldTypes });
  }

  // Add the pointer to delType to a type created in a different file
  makeType = (t) => {
    const newType = {
      id: t.id,
      typeName: t.typeName,
      time: t.time,
      delType: this.delType
    }
    return newType;
  }

  // Delete or replace a machine after edit
  delType = (id, type) => {
    var oldTypes = this.state.types;
    for(var i = 0; i < oldTypes.length; i++) {
        if(oldTypes[i].id === id) {
          if(type){
            const newType = this.makeType(type);
            oldTypes.splice(i, 1, newType);
          }
          else{
            console.log(oldTypes[i]);
            oldTypes.splice(i, 1);
          }
          break;
        }
    }
    this.setState({ types: oldTypes });
  }

  // Add pointers to functions to machines made in another file
  makeMachine = (m) => {
    const newMachine = {
      machineId: m.machineId,
      machineName: m.machineName,
      typeId: m.typeId,
      editMachine: this.editMachine,
      delMachine: this.delMachine
    }
    return newMachine;
  }

  // add new machine to correct machine type
  assignMachine = (machine) => {
    const newMachine = this.makeMachine(machine);
    var newMachineMap = this.state.machines;
    var newMachines = newMachineMap[machine.typeId];
    newMachines.push(newMachine);
    newMachineMap[machine.typeId] = newMachines;
    console.log(newMachines);
    var newUnassigned = this.state.unassigned;
    newUnassigned.shift();
    this.setState({ machines: newMachineMap });
  }

  // edit a machine (handles if machien changes type)
  editMachine = (oldType, machine) => {
    var newMachineMap = this.state.machines;
    // The list of machines for this mahcine's old type
    var oldMachines = newMachineMap[oldType];
    // The list of machines for this mahcine's new type
    var newMachines = newMachineMap[machine.typeId];
    for(var i = 0; i < oldMachines.length; i++) {
        // Find the machine in the list for the old type
        if(oldMachines[i].machineId === machine.machineId) {
          const newMachine = this.makeMachine(machine);
          //If same type just replace in same list
          if(oldType == machine.typeId){
            newMachines.splice(i, 1, newMachine);
            newMachineMap[machine.typeId] = newMachines;
            console.log(newMachines);
          }
          //else remove from old type and add to new type
          else{
            oldMachines.splice(i, 1);
            newMachines.push(newMachine);
            newMachineMap[oldType] = oldMachines;
            newMachineMap[machine.typeId] = newMachines;
            console.log(newMachines);
            console.log(oldMachines);
          }
          break;
        }
    }
    this.setState({ machines: newMachineMap });
  }

  // Delete machine from being displayed
  delMachine = (type, machineId) => {
    var newMachineMap = this.state.machines;
    var newMachines = newMachineMap[type];
    for(var i = 0; i < newMachines.length; i++) {
        if(newMachines[i].machineId === machineId) {
          newMachines.splice(i, 1);
          newMachineMap[type] = newMachines;
          break;
        }
    }
    this.setState({ machines: newMachineMap });
  }

  render() {
    var unassignedMachine;
    // If there is an unassigned machine, display the assign button with first unassigned machine
    if(this.state.unassigned.length>0){
      unassignedMachine = this.state.unassigned[0];
      console.log(unassignedMachine);
      return (
      <div >
        <span id="heading" >
          <h2>Machine Types </h2>
          <NewMachineTypeButton addType={this.addType}/>
        </span>
        <div style={{float: "right"}}>
          <AutoComplete
            dataSource={this.state.filteredAutoComplete}
            placeholder="Search machines"
            onSearch={this.filterTypes}
            onSelect={this.filterTypes}
            style={{ width: 200 }}
          />
        </div>
        <div style={{float: "right"}}>
          <AssignNewMachineButton 
            machine = {unassignedMachine}
            types = {this.state.types}
          />
        </div>
        <Table 
          rowKey="id" 
          dataSource={this.state.filteredTypes} 
          columns={columns} 
          expandedRowRender={this.expandRow}
        />
      </div>
    );
    }
    else{
      console.log(this.state.unassigned.length);
      return (
        <div>
          <span id="heading">
            <h2>Machine Types </h2>
            <NewMachineTypeButton addType={this.addType}/>
          </span>
          <div style={{float: "right"}}>
            <AutoComplete
              dataSource={this.state.filteredAutoComplete}
              placeholder="Search machines"
              onSearch={this.filterTypes}
              onSelect={this.filterTypes}
              style={{ width: 200 }}
            />
          </div>
          <Table 
            rowKey="id" 
            dataSource={this.state.filteredTypes} 
            columns={columns} 
            expandedRowRender={this.expandRow}
          />
        </div>
      );
    }
  }
}
 
export default MachinePage;