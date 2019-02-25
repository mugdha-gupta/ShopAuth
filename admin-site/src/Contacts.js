import React from "react";
import "./Contacts.css";
import PropTypes from "prop-types";

function Contacts(props) {
  return (
    <div className="contacts">
      <span>{props.name}</span>
    </div>
  );
}

Contacts.propTypes = {
  name: PropTypes.string.isRequired
};

export default Contacts;