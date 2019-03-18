import React from "react";

import User from "./UserCollapsible";

function UserListCollapsible(props) {
  return (
    <div>
      {props.usersarray.map(u => <User key={u.id} name={u.name} email={u.email} />)}
    </div> 
  ); 
} 

export default UserListCollapsible;