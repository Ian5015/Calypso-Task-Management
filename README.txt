v0.1 - This is the first commit of the app, and only the signup and login functionality has been completed. 
**Supervisors are set with a boolean isSupervisor for the user in the db. This is currently manually being set by editing the document after a user has signed up, using Robomongo.
====================
#Starting MongoDB (MongoDB must be installed on PC, and class paths must be set)

1. In a bash shell (e.g. Git Bash): mongod

if dbpath isn't set, in cmd
c:\MongoDB\bin\mongod --dbpath c:\MongoDB\data

====================
#Starting the web server

In bash shell: node server.js (note: Node.js must be installed).

In your browser, go to http://localhost:8080/

Now you can sign up or log in.
