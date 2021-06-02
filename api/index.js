import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import seq from 'sequelize';
const { Sequelize, DataTypes, Op } = seq;
import cors from 'cors';

import libraryModel from './models/library.js'
import settingsModel from './models/settings.js'


import Computations from '../src/computations/index.js'
import library from './models/library.js';


const port = process.env.BACKEND_PORT
const dbName = 'cellstore_db_test'
const dbUsername = 'postgres'
const dbPassword = '123'
const dbHost = 'localhost'
// const dbPort = 5432


// ESTABLISH DATABASE CONNECTION

// create database if not exist
const baseSequelize = new Sequelize('postgres', dbUsername, dbPassword, {
  host: dbHost,
  dialect: 'postgres'
})

await baseSequelize.query(`CREATE DATABASE ${dbName}`).catch(() => { console.log('Database already exists, skipping creation') })
baseSequelize.close()

// connect to actual database
const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
})

// test connection
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// create default tables if not exist
const models = {
  Library: libraryModel(sequelize, DataTypes),
  Settings: settingsModel(sequelize, DataTypes)
}

sequelize.sync()

// this is the query library
const queryInterface = sequelize.getQueryInterface();



// SETUP WEB SERVER

const app = express();
app.use(express.json())
app.use(cors())

// DEFINE REQUESTS

// I don't thing this will be exposed in the end, 
// just can be used as a private function with definitions stored
// in JS files

app.all('/getSettings', async (req, res) => {

  console.log('requesting settings or null if do not exist yet')

  const settings = await models.Settings.findByPk('settings')


  if (settings) res.status(200).send(settings['data'])

  res.status(520).send()

})

app.all('/setSettings', async (req, res) => {

  const payload = req.body['payload']

  console.log('updating settings')
  const object = { key: 'settings', data: payload }

  const setting = await models.Settings.findOrCreate(

    {
      where: { key: 'settings' },
      defaults: object
    },
  )

  if (!setting[1]) await models.Settings.update(object, { where: { key: 'settings' } })

  res.status(200).send()

})


const DATA_TYPE_MAPS = {
  string: DataTypes.STRING,
  int: DataTypes.INTEGER,
  multiselect: DataTypes.INTEGER
}

const DATA_TYPE_STRING_MAPS = {
  string: "STRING",
  int: "INTEGER",
  multiselect: "INTEGER"
}

app.all('/createLibrary', async (req, res) => {

  const { name, fields } = req.body
  const libraryDefinition = req.body

  // create database schema

  const schema = Object.fromEntries(fields.map(field => {
    const def = {
      type: DATA_TYPE_MAPS[field.dataType],
      primaryKey: field.primaryKey
    }
    return [field['name'], def]
  }))

  const LibraryModel = sequelize.define(name, schema, {
    freezeTableName: true,
    tableName: name
  })

  // create table

  await LibraryModel.sync()

  // TODO create tables for data types

  // store info in database
  const dbSchema = Object.fromEntries(fields.map(field => {
    const def = {
      type: DATA_TYPE_STRING_MAPS[field.dataType],
      primaryKey: field.primaryKey
    }
    return [field['name'], def]
  }))

  await models.Library.create({ key: name, definition: libraryDefinition, schema: dbSchema })

  res.status(200).send()

})

app.all('/getLibraries', async (req, res) => {

  const libraries = await models.Library.findAll({
    attributes: ['definition']
  })

  res.status(200).send(libraries.map(library => library.definition))

})

app.all('/getLibrary', async (req, res) => {

  const libraryName = req.body['libraryName']

  const library = await models.Library.findByPk(libraryName)

  if (!library) res.status(404).send()
  else res.status(200).send(library['definition'])

})

app.all('/getCell', async (req, res) => {

  const libraryName = req.body['libraryName']
  const cellId = req.body['cellId']

  const library = await models.Library.findByPk(libraryName)

  const newLibrary = sequelize.define(libraryName, library['schema'], {
    freezeTableName: true,
    tableName: libraryName
  }
  )
  const data = await newLibrary.findByPk(cellId)

  if (!newLibrary) res.status(404).send()
  else res.status(200).send(data)
})

app.all('/getLibraryData', async (req, res) => {

  const libraryName = req.body['libraryName']

  const library = await models.Library.findByPk(libraryName)

  const newLibrary = sequelize.define(libraryName, library['schema'], {
    freezeTableName: true,
    tableName: libraryName
  }
  )
  const data = await newLibrary.findAll()

  if (!newLibrary) res.status(404).send()
  else res.status(200).send(data)

})

app.all('/createLibraryDB', async (req, res) => {

  const key = req.body['libraryName']
  const data = req.body['libraryColumns']
  const options = req.body['libraryOptions']

  console.log(`creating library database ${key}`)

  // add entry to library 'cache' table
  await models.Library.create({ key: key, data: data, options: options })

  // create table for library
  const newLibrary = sequelize.define(key, data, options)
  await newLibrary.sync()

  res.status(200).send()

})

app.all('/addItemToLibrary', async (req, res) => {

  const name = req.body['libraryName']
  const item = req.body['libraryItem']

  console.log(`adding item to library ${name}`)

  const { key, schema } = await models.Library.findByPk(name)

  // reconstruct data type object from string representation
  for (const property in schema) {
    console.log(schema[property]['type'])
    schema[property]['type'] = DataTypes[schema[property]['type']]

  }

  // TODO fix create library schema data type

  // define library object and create if not created
  const newLibrary = sequelize.define(key, schema, {
    freezeTableName: true,
    tableName: name
  })
  await newLibrary.sync()

  // add item to library
  await newLibrary.create(item)

  res.status(200).send()

})

app.all('/getFilteredCells', async (req, res) => {
  const libraryName = req.body['libraryName']
  const filters = req.body['filters']

  console.log(filters)

  var where = {}

  // transform filters into usable versions

  for (const filter of filters) {
    if (filter.dataType === 'multiselect') {
      where[filter.name] = { [Op.or]: filter.filter }
    }

    if (filter.dataType === 'int' || filter.dataType === 'string') {
      where[filter.name] = { [Op[filter.filter.operator.value]]: filter.filter.value }
    }
  }

  const library = await models.Library.findByPk(libraryName)

  const newLibrary = sequelize.define(libraryName, library['schema'], {
    freezeTableName: true,
    tableName: libraryName
  }
  )

  const data = await newLibrary.findAll({ where: where })

  res.status(200).send(data)
})


app.all('/getComputations', async (req, res) => {

  // get from code
  const definitions = Computations.initDefinitions()

  // TODO get from DB

  res.status(200).send(definitions)

})

app.all('/getComputation', async (req, res) => {

  const computationName = req.body['computationName']

  // get from code
  const definition = Computations.initDefinition(computationName)

  // TODO get from DB

  if (!definition) res.status(404).send()
  else res.status(200).send(definition)

})
// hello world request
app.all('/', (req, res) => {
  console.log('Request received')
  res.send('hello world')
})

app.post('/runComputation', async (req, res) => {

  const computationName = req.body['computationName']
  const computationParams = req.body['computationParams']

  try {
    const output = await Computations.run(computationName, computationParams)
    res.status(200).send(output)
  } catch (e) {
    res.status(500).send(e.message)
  }

})

app.post('/deleteLibrary', async (req, res) => {
  const libraryName = req.body['libraryName']

  const model = await models.Library.findByPk(libraryName)
  const { key, schema } = model

  // reconstruct data type object from string representation
  for (const property in schema) {
    schema[property]['type'] = DataTypes[schema[property]['type']]

  }

  // TODO fix create library schema data type

  // define library object and create if not created
  const newLibrary = sequelize.define(key, schema, {
    freezeTableName: true,
    tableName: libraryName
  })

  await newLibrary.drop()
  await model.destroy()

  res.status(200).send()

})

app.post('/runComputationOnLibrary', async (req, res) => {

  const libraryName = req.body['libraryName']
  const computationName = req.body['computationName']
  const computationMaps = req.body['computationMaps']

  const { key, schema } = await models.Library.findByPk(libraryName)

  // reconstruct data type object from string representation
  for (const property in schema) {
    schema[property]['type'] = DataTypes[schema[property]['type']]

  }

  // TODO fix create library schema data type

  // define library object and create if not created
  const newLibrary = sequelize.define(key, schema, {
    freezeTableName: true,
    tableName: libraryName
  })

  await newLibrary.sync()

  // figure out column names from computation maps
  const attributes = Object.keys(computationMaps).map(key => [computationMaps[key], key])

  // get values from library
  const libraryResults = await newLibrary.findAll({
    attributes: attributes
  })

  var final = []

  await libraryResults.forEach(async ({ dataValues }) => {
    // run computation
    const output = await Computations.run(computationName, dataValues)

    // add result back to temporary object
    final.push({ input: dataValues, output: output })

  })

  // return results
  res.status(200).send(final)

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

//TODO: turn the chunks of code into functions that can be called on the front end!

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


  //changes the datatype of a column to float
  function columnDatatypeFloat(table_name, column_name) {
    queryInterface.changeColumn(table_name, column_name, {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
      allowNull: false
    });
  }


  //changes the datatype of a column to int
  function columnDatatypeInt(table_name, column_name) {
    queryInterface.changeColumn(table_name, column_name, {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
  }


  function columnDatatypeString(table_name, column_name) {
    queryInterface.changeColumn(table_name, column_name, {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false
    });
  }

  //adds a primary key
  function addPrimaryKey(table_name, column_name, name_of_constraint_name) {
    queryInterface.addConstraint(table_name, {
      fields: [column_name],
      type: 'primary key',
      name: name_of_constraint_name
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

  function renameAColumn(table_name, column_name, new_column_name) {
    sequelize.query("ALTER TABLE " + table_name + " RENAME " + column_name + " TO " + new_column_name + ");");
  }

  function selectAllFromTable(table_name) {
    sequelize.query("SELECT * FROM " + table_name + ");");
  }

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

  //yeet


}


// START SERVER

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})