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
            data: {
                type: DataTypes.JSON
            },
            options: {
                type: DataTypes.JSON
            }
        },

        {
            freezeTableName: true,
            tableName: 'library'
        }
    )

