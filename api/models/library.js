export default (sequelize, DataTypes) =>

    sequelize.define(

        'library',

        {
            key: {
                type: DataTypes.STRING,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            definition: {
                type: DataTypes.JSON
            },
            schema: {
                type: DataTypes.JSON
            },
        },

        {
            freezeTableName: true,
            tableName: 'library'
        }
    )

