
export default (sequelize, DataTypes) =>

    sequelize.define(

        'users',

        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            hash: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            salt: {
                type: DataTypes.STRING,
                allowNull: false
            },
            activationKey: {
                type: DataTypes.STRING,
                allowNull: true
            },
            resetPasswordKey: {
                type: DataTypes.STRING,
                allowNull: true
            },
            verified: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            }
        },

        {
            freezeTableName: true,
            tableName: 'users'
        }

    )