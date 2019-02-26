import React from "react";
import "./User.css";
import PropTypes from "prop-types";

function User(props) {
  return (
    <div className="user">
      <span>{props.name}</span>
      <span>{props.email}</span>

    </div>
  );
}

User.propTypes = {
  name: PropTypes.string.isRequired
};

export default User;