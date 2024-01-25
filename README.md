# MEBN Bootstrap Website<br>

Welcome to the repository for our MEBN Bootstrap website! This project is designed to demonstrate a web application with a MEBN (MongoDB, Express.js, Bootstrap, Node.js) stack. The website includes various functionalities, and this readme provides an overview of the protocols and interactions involved.<br>

## Table of Contents<br>
- [Introduction](#introduction)<br>
- [GET Protocols](#get-protocols)<br>
  - [/ (Root)](#-root)<br>
  - [/admin](#-admin)<br>
  - [/manageUsers](#-manageusers)<br>
  - [/user](#-user)<br>
  - [/userHome](#-userhome)<br>
- [POST Protocols](#post-protocols)<br>
  - [/processAdminForm](#-processadminform)<br>
  - [/processUserForm](#-processuserform)<br>

## Introduction<br>

The MEBN Bootstrap website provides a user interface for administrators and regular users. It involves interactions using the GET and POST protocols, allowing for seamless navigation and data processing.<br>

## GET Protocols 
### / (Root)<br>
- Redirects to `/admin`.<br>

### /admin<br>
- Admin interacts with the UI.<br>
- Logs in with admin credentials.<br>
- Successfully logs in.<br>
- Gets redirected to the manageUsers page.<br>

### /manageUsers<br>
- Admin interacts with the UI.<br>
- Creates a User and sends a request to the server.<br>
- Express Server processes and sends a request to MongoDB API.<br>
- MongoDB API accesses the database and sends back a response.<br>
- The express server processes the response and sends back a response with Pug as a rendering engine.<br>

### /user<br>
- User login credent
