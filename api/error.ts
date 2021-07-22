const error = (
  next: any,
  type: "warning" | "error" | "message",
  title: string,
  message: string
) => {
  next({ title, detail: message, type, statusCode: 500 });
};

const errorCells = (
  next: any,
  type: "warning" | "error" | "message",
  title: string,
  message: string,
  cells: string[]
) => {
  next({ title, detail: message, type, cells, statusCode: 500 });
};

const missingParam = (next: any, param: string) => {
  return next({
    title: "Missing Parameter",
    detail: `The parameter ${param} is missing.`,
    type: "error",
    statusCode: 400,
  });
};

const invalidParam = (next: any, param: string) => {
  next({
    title: "invalidParam",
    detail: `The parameter ${param} is invalid.`,
    type: "error",
    statusCode: 400,
  });
};

// TODO typelist for complex objects

/** These are all of the possible "inputs" that could be in the body of a request */
const typeList: {[any: string]: "String" | "Object" | "Array"} = {
  settings: "Object",
  libraryName: "String",
  libraryDataType: "String",
  libraryDefinition: "String", // used to create a new library, could be merged with library
  libraryItem: "Object", // db object (to go into database)
  libraryItems: "Array", // array of db objects (to go into database)
  filters: "Object",
  dataType: "String",
  dataTypes: "Array", // of string
  cellIds: "Array",
  cellId: "String",
  columns: "Array", // attributes in findAll method of sequelize
  computationName: "String",
  computationMaps: "Object",
  computationParams: "Object",


};

const bodyCheck = (req: any, next: any, params: string[]) => {
  for (const param of params) {

    if (!req.body[param]) return missingParam(next, param);

    if (!(Object.keys(typeList).includes(param))) return invalidParam(next, param);

    if (!(Object.prototype.toString.call(req.body[param]) === `[object ${typeList[param]}]`)) return invalidParam(next, param);
  }
};

const middleware = (err: any, req: any, res: any, next: any) => {
  console.log(err.message)
  res.status(err.statusCode).send(err);
}

const errorLoggingMiddleware = (req: any, res: any, next: any) => {

}

export { error, errorCells, missingParam, invalidParam, bodyCheck, middleware };
