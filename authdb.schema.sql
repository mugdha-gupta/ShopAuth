
CREATE DATABASE IF NOT EXISTS authdb;

USE authdb;

CREATE TABLE IF NOT EXISTS authdb.user (
  id BIGINT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  scan_string VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
); 

CREATE TABLE IF NOT EXISTS authdb.machine_type ( 
  id BIGINT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  displayname VARCHAR (255) NOT NULL,
  time1 TIME,
  time2 TIME,
  time3 TIME,
  time4 TIME
);

CREATE TABLE IF NOT EXISTS authdb.machine (
  id BIGINT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  type BIGINT NOT NULL,
  FOREIGN KEY (type) REFERENCES authdb.machine_type (id) ON DELETE RESTRICT,
  displayname VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS authdb.auth (
  user_id BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES authdb.user (id) ON DELETE RESTRICT,
  machine_type_id BIGINT NOT NULL,
  FOREIGN KEY (machine_type_id) REFERENCES authdb.machine_type (id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS authdb.admin (
  user_id BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES authdb.user (id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS authdb.log (
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NULL,
  machine_id BIGINT NOT NULL,
  FOREIGN KEY (machine_id) REFERENCES authdb.machine (id) ON DELETE RESTRICT,
  user_id BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES authdb.user (id) ON DELETE RESTRICT,
  witness_id VARCHAR(255) NOT NULL
);

