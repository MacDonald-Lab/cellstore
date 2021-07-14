import papa from "papaparse";

const onAdd = (files) => {
  return files[0];
};

const onSubmit = (files, submit) => {
  papa.parse(files, {
    header: true,
    complete: (results) => {
      submit(results.data)
    },
  });


};

const onDatabaseImport = async (object, library) => {

  var submitData = [];
  
  for (const item of object) {
    const keys = Object.keys(item);
    const idKey = keys[0];
    const id = item[idKey]
    if (id === "") continue
    delete item[idKey];

    // TODO fix if one item has error, continue to next item

    submitData = [...submitData, { expressionData: item, libraryKey: id }];
  }

  library.bulkCreate(submitData);
};

export { onAdd, onSubmit, onDatabaseImport };
