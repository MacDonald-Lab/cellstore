export default (sequelize, DataTypes) =>
  sequelize.define(
    "computationHistory",

    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      libraryName: {
        type: DataTypes.STRING,
      },
      cellIds: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      computationName: {
        type: DataTypes.STRING,
      },
      computationMaps: {
        type: DataTypes.JSON
      },
      results: {
        type: DataTypes.JSON,
      },
    },

    {
      freezeTableName: true,
      tableName: "computationHistory",
    }
  );
