CREATE DATABASE IF NOT EXISTS authdb;

USE authdb;

CREATE TABLE IF NOT EXISTS authdb.user (
  id BIGINT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  scan_string VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  admin_level TINYINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS authdb.machine_type (
  id BIGINT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  displayname VARCHAR (255) NOT NULL,
  time1 TIME
);

CREATE TABLE IF NOT EXISTS authdb.machine (
  id BIGINT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  type BIGINT,
  FOREIGN KEY (type) REFERENCES authdb.machine_type (id) ON DELETE RESTRICT,
  displayname VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS authdb.auth (
  id BIGINT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  user BIGINT NOT NULL,
  FOREIGN KEY (user) REFERENCES authdb.user (id) ON DELETE RESTRICT,
  type BIGINT NOT NULL,
  FOREIGN KEY (type) REFERENCES authdb.machine_type (id) ON DELETE RESTRICT
);


CREATE TABLE IF NOT EXISTS authdb.log (
  starttime TIMESTAMP NOT NULL,
  endtime TIMESTAMP NULL,
  machine BIGINT NOT NULL,
  FOREIGN KEY (machine) REFERENCES authdb.machine (id) ON DELETE RESTRICT,
  user BIGINT NOT NULL,
  FOREIGN KEY (user) REFERENCES authdb.user (id) ON DELETE RESTRICT,
  witness VARCHAR(255) NOT NULL
);

create table oauth_client_details (
    client_id VARCHAR(256) PRIMARY KEY,
    resource_ids VARCHAR(256),
    client_secret VARCHAR(256),
    scope VARCHAR(256),
    authorized_grant_types VARCHAR(256),
    web_server_redirect_uri VARCHAR(256),
    authorities VARCHAR(256),
    access_token_validity INTEGER,
    refresh_token_validity INTEGER,
    additional_information VARCHAR(4096),
    autoapprove VARCHAR(256)
);
