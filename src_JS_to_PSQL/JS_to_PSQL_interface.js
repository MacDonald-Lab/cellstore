const http = require('http');
const { Sequelize, DataTypes, QueryInterface } = require('sequelize');

const hostname = '127.0.0.1';
const port = 3000;

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

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('test');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//The next chunk creates Database pieces

//This chunk creates a table, only if it doesn't already exist
queryInterface.createTable('patient_extra_info', {
  name: DataTypes.STRING,
  isBetaMember: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});

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
for (let i = 0; i < (column_n + 1); i++){
    queryInterface.addColumn('gene_expression', `gene${i}`, {type: DataTypes.STRING });
}

//removes these columns
for (let i = 0; i < (column_n + 1); i++){
  queryInterface.removeColumn('gene_expression', `gene${i}`, {});
}

//Trying to deletes all columns in gene_expression using this, but isn't quite working yet
/*
queryInterface.bulkDelete('gene_expression', null, {});     
*/

//deletes all tables !!!CAREFUL!!! 
/*
queryInterface.dropAllTables(cell_db, {})
*/

queryInterface.renameTable('gene_expression', 'gene_expression_and_ID', {});

//
//TODO: 
//
// - Look into creating an array/list that carries all organized column names
// - Pull from the list using a for loop
// - Use the previous method to populate the cell_store database!
//
