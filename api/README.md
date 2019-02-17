# Getting API Running
## Steps
 1. [Install Mysql](#installation)<sup>[1](#myfootnote1)</sup>
 2. [Start server](#start-stop-mysql-server)
 3. [Load SQL file](#load-sql-file-to-server)<sup>[1](#myfootnote1)</sup>
 4. [Open API Project](#open-api-project)<sup>[1](#myfootnote1)</sup>
 5. [Synchronize pom.xml](#synchronize-pom)<sup>[1](#myfootnote1)</sup>
 6. Run MainApplicationClass file
 7. View swagger documentation at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
<br /><a email="myfootnote1"><sup>1<sup/></a> Only needed first time starting server on machine

## Installation

Install [Mysql](https://dev.mysql.com/downloads/mysql/) server.

## Start Stop Mysql Server
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
## Open API Project
 From intellij open new project by choosing the pom.xml file

## Synchronize pom
 Have project open in intellij<br />
 Right click on pom.xml file<br />
 Click on "Synchronize pom.xml"
