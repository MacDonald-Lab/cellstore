export default (sequelize, DataTypes) =>
  sequelize.define(
    "messages",

    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      title: {
        type: DataTypes.STRING,
      },
      detail: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      additional: {
        type: DataTypes.JSON,
      },
    },

    {
      freezeTableName: true,
      tableName: "messages",
    }
  );
