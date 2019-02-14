# Getting API Running

## Installation

Install [Mysql](https://dev.mysql.com/downloads/mysql/) server.

## Start/Stop Mysql server
* ### Windows
  * Start
    ```bash
    "C:\Program Files\MySQL\MySQL Server 5.0\bin\mysqld"
    ```
  * End
    ```bash
    "C:\Program Files\MySQL\MySQL Server 5.0\bin\mysqladmin" -u root shutdown
    ```
* ### Mac
  * Start
    ```bash
    sudo launchctl load -F /Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist
    ```
  * End
    ```bash
    sudo launchctl unload -F /Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist
    ```
* ### Linux
  * Start
    ```bash
    /etc/init.d/mysqld start
    ```
  * End
    ```bash
    /etc/init.d/mysqld stop
    ```
## Load SQL File to Server
  ```bash
  mysql -u root -p authdb < ./api/src/main/resources/authdb.schema.sql
  ```
