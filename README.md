# A Node.js Course Library API System

## Description
This **Node.js** project is focused on building a **REST API** designed to manage courses within a library setting. Developed entirely in **Typescript**, the API leverages the **TypeORM** framework to facilitate seamless interaction between the application logic and a **PostgreSQL** database.

In addition to supporting basic **CRUD** operations (Create, Read, Update, Delete) for tasks, the API includes robust features such as a **JWT**-based authentication system and middleware integration. While certain endpoints are accessible to the public, others necessitate authentication via a registered account.

## How to run
- confgure a new PostgreSQL database and set the environment variables for connection (.env file at app root level)
- open a terminal and navigate to the app root directory
- run the "npm install" command
- run the "npm start" command
- use a HTTP client to make API requests (ex.: Postman)
- by default the app listens at http://localhost:3000

## Disclaimer
*_This is just a playground project_
