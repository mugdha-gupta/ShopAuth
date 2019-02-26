import React from "react";

import User from "./User";

function UserList(props) {
  return (
    <div>
      {props.usersarray.map(u => <User key={u.id} name={u.name} />)}
    </div> 
  ); 
} 

export default UserList;