import Sequelize from 'sequelize'

const database = async ({ dbName, dbUsername, dbPassword, dbHost }) => {

    // create database if not exist

    // connect to default database
    const baseSequelize = new Sequelize('postgres', dbUsername, dbPassword, {
        host: dbHost,
        dialect: 'postgres'
    })

    // query to create a table if not exist
    await baseSequelize.query(`CREATE DATABASE ${dbName}`).catch(() => { console.log('Database already exists, skipping creation') })
    baseSequelize.close()

    // connect to actual database
    const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
        host: dbHost,
        dialect: 'postgres',
    })

    // test connection
    // TODO get rid of?
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    return sequelize

}

export default database