
// this is the query library
const queryInterface = sequelize.getQueryInterface();


//This chunk creates a table, only if it doesn't already exist
router.post('/createTable', (req, res) => {

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
  //oldtodo: add error checking with promises

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