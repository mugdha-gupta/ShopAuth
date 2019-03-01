import React from "react";
import PropTypes from "prop-types";
import Collapsible from 'react-collapsible'

function UserCollapsible(props) {
  return (
    <Collapsible trigger=<span>{props.name}	      {props.email}</span>>
        <p>This is the collapsible content. It can be any element or React component you like.</p>
        <p>It can even be another Collapsible component. Check out the next section!</p>
     </Collapsible>
  );
}

UserCollapsible.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
};



export default UserCollapsible;