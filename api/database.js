import Sequelize from 'sequelize'
// import {remote} from 'electron'

const database = async ({ dbName, dbUsername, dbPassword, dbHost }) => {

    // create database if not exist

    
    // TODO error connecting to db
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

    // SQLITE

    // const app = remote.app
    // const defaultPath = app.getPath('userData')
    // const baseSequelize = new Sequelize({
    //     dialect: 'sqlite',
    //     storage: defaultPath + '/database.sqlite'
    // });

    // // query to create a table if not exist
    // await baseSequelize.query(`CREATE DATABASE ${dbName}`).catch(() => { console.log('Database already exists, skipping creation') })
    // baseSequelize.close()

    // // connect to actual database
    // const sequelize = new Sequelize({
    //     dialect: 'sqlite',
    //     storage: defaultPath + '/database.sqlite'
    // });



    // test connection
    return sequelize

}

export default database