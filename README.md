# About the project
This project is a simple task management application made using ExpressJS + mongoDB.
For the frontend, this is the [link](https://github.com/ckw28502/taskflare-reactjs)

The database is running on docker so you don't need to install mongoDB on your local machine

# Requirement
- Node v18
- NPM v9

# Install libraries
```bash
npm install
```

# Prequisite steps
- copy .env.examples and paste it as .env
- fill the mongodb uri to URI to database (default is mongodb://localhost:27017)
- fill the mongodb username and password
- fill the jwt secret and jwt refresh secret
- copy .env and paste it as .env.docker
- replace the mongodb uri for .env.docker to URI to database ( default is mongodb://taskflare-expressjs-db-1:27017 )

## Reasoning why we have 2 URI
the reason .env and .env.docker path have different URI is the backend itself. for .env, we use the mapped port from docker to localhost since we use .env for local environment. For .env.docker, it will be used at docker environment so we use the direct URI to the db container since both are in the same network

# Seeding the database
```bash
npm run seed
```
note: this will remove all inserted documents on mongoDB. proceed with caution

# Running the project on local server
```bash
npm start
````
# Testing
```bash
npm run test
```
note: sometimes the test db server causing error. You can retry the test again

# Running on docker
You need to have docker installed and running on your machine
It also needs to be able run docker compose
```
docker compose up --detach
```

To stop the application
```
docker compose down --volumes
```
