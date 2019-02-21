# Getting API Running
 1. [Dependency Installation](#dependecy-installation)
 2. [Load SQL File](#load-sql-file)
 3. [Initialize Project](#initialize_project)
 4. [Run the project](#run-the-application)
 5. [Run requests](#run-requests)
 6. [Test the endpoints](#test-the-endpoints

## Dependency Installation

#### Install [MySQL](https://dev.mysql.com/downloads/mysql/) server

If you are on a Linux system, there is an apt package on the apt repositories. 
```bash
sudo apt install mysql-server
```
##### Check Path
Check to ensure that mysql is on your system path. In bash, you can check with:
```bash
command -V mysql
```
If it is not, add it appropriate to your system.
 * Mac/Linux
    ```bash
     echo 'export PATH="/usr/local/mysql/bin:$PATH"' >> ~/.bash_profile
     ```
 * Windows    
    Go to Environment Variables<br />
    Add variable MYSQL_HOME if not already existing<br />
    Add path to MySQL\MySQL Server 8.0\bin in MYSQL_HOME variable<br />
    add MYSQL_HOME variable to PATH<br />

##### Start/Stop MySQL Server
Make sure that MySQL is running. To start or stop, you can use these commands:
* Windows
  * Start
    ```bash
    "C:\Program Files\MySQL\MySQL Server 5.0\bin\mysqld"
    ```
  * End
    ```bash
    "C:\Program Files\MySQL\MySQL Server 5.0\bin\mysqladmin" -u root shutdown
    ```
* Mac
  * Start
    ```bash
    sudo launchctl load -F /Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist
    ```
  * End
    ```bash
    sudo launchctl unload -F /Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist
    ```
* Linux
  * Start
    ```bash
    /etc/init.d/mysqld start
    ```
  * End
    ```bash
    /etc/init.d/mysqld stop
    ```

#### Install [Maven](https://maven.apache.org/download.cgi)
If you are not already using IntelliJ, you will have to install Maven separately. Maven is the build system and package manager for large-scale Java projects.

If you are on a Linux system, there is an apt package on the apt repositories. 
```bash
sudo apt install maven
```

## Load SQL File to Server
Load the schema file onto the server, which is located at `api/src/main/resources/authdb.schema.sql` from the project root.
  ```bash
  C:> mysql -u root -p
  mysql> CREATE DATABASE authdb;
  mysql> \. api/src/main/resources/authdb.schema.sql;
  ```
## Initialize Project - IntelliJ

Open new project by choosing the pom.xml file.

#### Synchronize pom
 Have project open in IntelliJ<br />
 Right click on pom.xml file<br />
 Click on "Synchronize pom.xml"

#### Change MySQL password
   Change the password entry in application.properties<br />
   To ensure you do not commit this information to GitHub:<br />
   * Open commit window<br />
   * Right click application.properties<br />
   * Move to another Changelist<br />
   * Create a new Changelist (ex. titled NoCommit)<br />

Now, application.properties will never be in your default commits <br />

## Initialize Project - Command Line

Initialize the project by running:
```bash
mvn install
```
This will install the project's dependencies using Maven.

#### Change MySQL password
Edit the file `api/src/main/resources/application.properties` and change the line
```bash
spring.datasource.password=<insert mysql password here>
```
to use whatever the password is for that database user (default `root`).

Make sure that you add this file to your `.gitignore` for the project to ensure your password is not stored in the repostiroy. If editing the `.gitignore` doesn't work, try running
```bash
git update-index --assume-unchanged api/src/main/resources/application.properties
```

## Run the project 
In IntelliJ, run MainApplicationClass.java.

On the command line, run the project using Maven in the same directory as `pom.xml`:
```bash
mvn spring-boot:run
```

## Test the endpoints. 

You can test the API by connecting to the swagger.io page hosted on the server, at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

Otherwise, one can use `curl` or `wget` or other HTTP request-making programs to test the endpoints at `http://localhost:8080/`.

