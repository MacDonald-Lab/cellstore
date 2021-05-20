export default (sequelize, DataTypes) =>

    sequelize.define(

        'settings',

        {
            key: {
                type: DataTypes.STRING,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            data: {
                type: DataTypes.JSON
            }
        },

        {
            freezeTableName: true,
            tableName: 'settings'
        }

    )