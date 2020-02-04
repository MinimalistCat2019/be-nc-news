# Northcoder News

This is the back end of the Northcoder News api, a Reddit-style news aggregation site which allows users to read, vote and comment on articles.

## Background

This is the api I built to use in the Northcoders News Sprint during the Front End block of Northcoders.

### Hosted Api 
https://paula-nc-news.herokuapp.com/api


## How to clone, run and test the project locally

### 1
In your terminal type the following commands: 
```
git clone https://github.com/MinimalistCat2019/be-nc-news.git
```
cd be-nc-news
```
code .
```

The project should now open in your code editor of choice, such as Visual Studio Code. 

### 2 
Install the following dependencies globally:
Node.JS
NPM 
PostgreSQL

### 3
Install the following developer dependencies:
Chai
Chai-Sorted
Express
Knex
Mocha 
Node Postgres
Supertest

### 4
cd into the main be-nc-news folder and create a local knexfile.js containing the following code: 

const { DB_URL } = process.env;

const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news'
      // user, if a Linux User
      // password if a Linux User
    },
  
  },

  production: {
    connection: `${DB_URL}?ssl=true`,
  },
  
  test: {
    connection: {
      database: 'nc_news_test'
      // user, if a Linux user
      // password, if a Linux user
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };


### 5
Set up your test and development databases by running the following commands in your terminal: 

```
psql

```
\c nc_news_test

### 6

You can run the test suite to locally test that all the endpoints are working correctly: 

npm t

### 7

You can view  all of the enpoints here: https://paula-nc-news.herokuapp.com/api


