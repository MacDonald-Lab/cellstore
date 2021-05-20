import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import seq from 'sequelize';
const { Sequelize, DataTypes } = seq;

const port = process.env.BACKEND_PORT
const dbName = 'cellstore_db_test'
const dbUsername = 'postgres'
const dbPassword = '123'
const dbHost = 'localhost'
// const dbPort = 5432


//TODO: turn the chunks of code into functions that can be called on the front end!


// ESTABLISH DATABASE CONNECTION


const getConnection = (name) => new Sequelize(name, dbUsername, dbPassword, {
  host: dbHost,
  dialect: 'postgres'
})

// create database if not exist
// TODO: refactor so this only runs when there is no database

const baseSequelize = getConnection('postgres')
baseSequelize.query(`CREATE DATABASE ${dbName}`)
baseSequelize.close()

// connect to actual database
const sequelize = getConnection(dbName)

// create default table to store settings if not exist
// TODO move to models file
const cellstore_table = sequelize.define('cellstore', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true,
    allowNull: false

  },
  data: {
    type: DataTypes.JSON
  }
},
  {
    freezeTableName: true,
    tableName: 'cellstore'
  }
)

cellstore_table.sync()

//this is the query library
const queryInterface = sequelize.getQueryInterface();


// test connection
try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}



// SETUP WEB SERVER

const app = express();
app.use(express.json())
// app.use(cors())

// DEFINE REQUESTS

// hello world request
app.all('/', (req, res) => {
  console.log('Request received')
  res.send('hello world')
})


//This chunk creates a table, only if it doesn't already exist
app.post('/createTable', (req, res) => {

  console.log(`Request recieved to create table ${req.body.tableName}`)
  queryInterface.createTable(req.body.tableName, {
    name: DataTypes.STRING,
    isBetaMember: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  });
  res.status(200).send()
})

const allFunctions = () => {


  //_________________
  //UTILITY FUNCTIONS
  //_________________

  //*** a resolve and reject has been added into a promise in order to later add error checking ***
  //TODO: add error checking with promises

  //simple sleep functions
  function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, (seconds * 1000)));
  }


  //function to rename a table
  function renameATable(original_name, new_name) {
    return new Promise(function (resolve, reject) {

      queryInterface.renameTable(original_name, new_name, {});

      resolve();
    });
  }


  //function to add columns using a numbered system
  function addNamedColumns(table_name, array_of_columns) {
    return new Promise(function (resolve, reject) {

      let column_n = array_of_columns.length;
      for (let i = 0; i < (column_n + 1); i++) {
        queryInterface.addColumn(table_name, array_of_columns[i], { type: DataTypes.STRING });
      }

      resolve();
    });
  }


  //deletes an array of columns that are passed in
  function deleteNamedColumns(table_name, columns_array) {
    return new Promise(function (resolve, reject) {

      let column_n = columns_array.length;
      for (let i = 0; i < (column_n + 1); i++) {
        queryInterface.removeColumn(table_name, columns_array[i], {});
      }

      resolve();
    });
  }


  //create a specified column
  function createAColumn(table_name, column_to_add) {
    return new Promise(function (resolve, reject) {

      queryInterface.addColumn(table_name, column_to_add, { type: DataTypes.STRING });

      resolve();
    });
  }


  //deletes a specified column
  function deleteAColumn(table_name, column_to_drop) {
    return new Promise(function (resolve, reject) {

      queryInterface.removeColumn(table_name, column_to_drop, {});

      resolve();
    });
  }


  //creates a table in this name
  function createATable(table_name) {
    return new Promise(function (resolve, reject) {

      queryInterface.createTable(table_name, {
        name: DataTypes.STRING,
        isBetaMember: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false
        }
      });

      resolve();
    });
  }


  //deletes a table
  function deleteATable(table_name) {
    return new Promise(function (resolve, reject) {

      queryInterface.dropTable(table_name, {});

      resolve();
    });
  }

  //*****************************
  //RAW SQL BASED FUNCTIONS RSBFs 
  //*****************************

  //populate column
  function populateColumn(table_name, column_name, inserted_data) {
    sequelize.query("INSERT INTO " + table_name + "(" + column_name + ") VALUES(" + inserted_data + ");");
  }

  //populate table with multiple columns full of data
  function populateColumns(table_name, columns_array, inserted_data_array) {
    let column_n = columns_array.length;
    for (let i = 0; i < (column_n + 1); i++) {
      sequelize.query("INSERT INTO " + table_name + "(" + columns_array[i] + ") VALUES(" + inserted_data_array[i] + ");");
    }
  }

  //Tane's TODO: -Add primary key, constraints, select and alter functionality to the functions

  //NOTE using raw queries may make the program vulnerable to SQL injection?

  //______________
  //test function
  //______________

  async function test_all_functions() {
    deleteATable('gene_mutations');
    await sleep(2);
    createATable('gene_mutations');
    await sleep(2);
    createAColumn('gene_mutations', 'SOD1');
    await sleep(2);
    populateColumn('gene_mutations', 'SOD1', '1452')
    console.log("Test complete! Ctrl+C to exit");
  }

  test_all_functions();

  //yeet?


}


// START SERVER

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})