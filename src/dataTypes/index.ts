// import seq from 'sequelize'

import GeneExpression from "./GeneExpression";

const types = [GeneExpression];

const initDescriptions = () => types.map((type) => type.initDescription());

const initViews = (typeData: { [any: string]: any }) => {
  var views = [];
  for (const typeName of Object.keys(typeData)) {
    const type = types.find((value) => (value.initDescription().id = typeName));
    if (!type) continue;
    views.push(type.initView(typeData[typeName]));
  }
  return views;
};

const getDatabaseDefinition = (typeName: string) => {
  const type = types.find((value) => (value.initDescription().id = typeName));
  if (!type) return;
  return type.getDatabaseDefinition;
};

const getDefinition = (typeName: string) => {
  const type = types.find((value) => (value.initDescription().id = typeName));
  if (!type) return;
  return type.initDescription();
};

const getOnAdd = (typeName: string) => {
  const type = types.find((value) => (value.initDescription().id = typeName));
  if (!type) return;
  return type.onAdd;
};

const getType = (typeName: string) => {
  const type = types.find((value) => (value.initDescription().id = typeName));
  if (!type) return;
  return type;
};

const moduleExports = {
  initViews,
  initDescriptions,
  getDatabaseDefinition,
  getDefinition,
  getOnAdd,
  getType,

  GeneExpression,
};

export default moduleExports;
