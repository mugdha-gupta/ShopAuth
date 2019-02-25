import React from "react";

import Contacts from "./Contacts";

function ContactList(props) {
  return (
    <div>
      {props.contactsarray.map(c => <Contacts key={c.id} name={c.name} />)}
    </div> 
  ); 
} 

export default ContactList;