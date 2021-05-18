import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'

import pkg from 'sequelize';
const { Sequelize, DataTypes, QueryInterface } = pkg;
//TODO: turn the chunks of code into functions that can be called on the front end!

const port = process.env.BACKEND_PORT

// ESTABLISH DATABASE CONNECTION

//You may want to change the name of the database
const sequelize = new Sequelize('cellstore_db', 'postgres', '123', {
    host: 'localhost',
    dialect: 'postgres'
});

//this is the query library
const queryInterface = sequelize.getQueryInterface();

//Tests the Data Base to see if it connected
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

  //Still isn't working in order, functions are not called consecutively 

  //Testing functions
  deleteATable('gene_mutations');
  createATable('gene_mutations');
  createAColumn('gene_mutations', 'SOD1');
  
  
  //FUNCTIONS
  
  //function to rename a table
  async function renameATable(original_name, new_name) {
    await queryInterface.renameTable(original_name, new_name, {});
  }
  
  //function to add columns using a numbered system
  async function addNamedColumns(table_name, array_of_columns){
    let column_n = array_of_columns.length;
    for (let i = 0; i < (column_n + 1); i++) {
      await queryInterface.addColumn(table_name, array_of_columns[i], {type: DataTypes.STRING });
    }
  }
  
  //deletes an array of columns that are passed in
  async function deleteNamedColumns(table_name, array_of_columns ){
    let column_n = array_of_columns.length;
    for (let i = 0; i < (column_n + 1); i++){
      await queryInterface.removeColumn(table_name, array_of_columns[i], {});
    }
  }
  
  //create a specified column
  async function createAColumn(table_name, column_to_add){
    await queryInterface.addColumn(table_name, column_to_add, {type: DataTypes.STRING });  
  }
  
  //deletes a specified column
  async function deleteAColumn(table_name, column_to_drop){
    await queryInterface.removeColumn(table_name, column_to_drop, {});
  }
  
  //creates a table in this name
  async function createATable(table_name){
    await queryInterface.createTable(table_name, {
      name: DataTypes.STRING,
      isBetaMember: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    });
  }
  
  async function deleteATable(table_name){
    await queryInterface.dropTable(table_name, {});
  }
  
  /*
  //populates a table with specified data bitsies
  async function populateColumn(table_name, column_name, inserted_data){
    sequelize.query("INSERT patient_extra_info (ID) VALUES (10450);")
  }
  */
  //NEEDS TO BE FIXED SO IT CAN PROPERLY POPULATE THE TABLE
  
  


}


// START SERVER

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})