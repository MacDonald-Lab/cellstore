import dotenv from 'dotenv';
dotenv.config()

import express from 'express';

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


// DEFINE REQUESTS

// hello world request
app.all('/', (req, res) => {
    console.log('Request received')
    res.send('hello world')
})


//This chunk creates a table, only if it doesn't already exist
app.post('/createTable', (req, res) => {
    queryInterface.createTable('patient_extra_info', {
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


  
  //This chunk creates a column within the specified table
  queryInterface.addColumn('patient_extra_info', 'Diabetes_status', { type: DataTypes.STRING });
  
  //Delete columns that are specified
  queryInterface.removeColumn('patient_extra_info', 'Diabetes_status', {});
  
  //Delete tables
  queryInterface.dropTable('patient_extra_info', {});
  
  
  //created to add genes into
  queryInterface.createTable('gene_expression', {
    name: DataTypes.STRING,
    isBetaMember: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  });
  
  let column_n = 4;
  //Loops through a specified number of times, likely a number which is the length of strings in an array
  //pulled from the columns of a csv file
  //This uses a simple numbering system
  for (let i = 0; i < (column_n + 1); i++){
      queryInterface.addColumn('gene_expression', `gene${i}`, {type: DataTypes.STRING });
  }
  
  //removes these columns
  for (let i = 0; i < (column_n + 1); i++){
    queryInterface.removeColumn('gene_expression', `gene${i}`, {});
  }
  
  //deletes all tables !!!CAREFUL!!! 
  /*
  queryInterface.dropAllTables(cell_db, {})
  */
  
  queryInterface.renameTable('gene_expression', 'gene_expression_and_ID', {});
  
  
  //test array that contains gene expressions 
  var gene_expressions = ["SOD1","BEX1","ID4","XR"];
  
  //Loops through gene_expression names and populates them into a table... with specific names
  let fLen = gene_expressions.length;
  for (let i = 0; i < fLen; i++) {
    queryInterface.addColumn('gene_expression_and_ID', gene_expressions[i], {type: DataTypes.STRING });
  }
  
  //Delete tables
  queryInterface.dropTable('gene_expression_and_ID', {});
  
  //function to rename a table
  function renameATable(original_name, new_name) {
    queryInterface.renameTable(original_name, new_name, {});
  }
  
  //function to add columns using a numbered system
  function addNamedColumns(table_name, array_of_columns){
    let fLen = array_of_columns.length;
    for (let i = 0; i < fLen; i++) {
      queryInterface.addColumn(table_name, array_of_columns[i], {type: DataTypes.STRING });
    }
  }
  
  //deletes an array of columns that are passed in
  function deleteNamedColumns(table_name, array_of_columns ){
    for (let i = 0; i < (column_n + 1); i++){
      queryInterface.removeColumn(table_name, array_of_columns[i], {});
    }
  }
  
  //deletes a specified column
  function deleteAColumn(table_name, column_to_drop){
    queryInterface.removeColumn(table_name, column_to_drop, {});
  }
  
  //creates a table in this name
  function createATable(table_name){
    queryInterface.createTable(table_name, {
      name: DataTypes.STRING,
      isBetaMember: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    });
  }
  
  /*
  //populates a table with specified data bitsies
  function populateColumn(table_name, column_name, inserted_data){
    db.sequelize.query("INSERT INTO")
  }
  */
  //NEEDS TO BE FIXED SO IT PROPERLY POPULATES THE TABLE

}


// START SERVER

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})