import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import seq from 'sequelize';
const { Sequelize, DataTypes } = seq;
import cors from 'cors';
import cookieSession from 'cookie-session';

import libraryModel from './models/library.js'
import settingsModel from './models/settings.js'

import authRoutes from './auth.js'
import apiRoutes from './api.js'


// GET DATABASE PROPERTIES


const port = 5000
const dbName = 'cellstore_db_test'
const dbUsername = 'postgres'
const dbPassword = '123'
const dbHost = 'localhost'
// const dbPort = 5432


// ESTABLISH DATABASE CONNECTION


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

// create default tables if not exist
const models = {
  Library: libraryModel(sequelize, DataTypes),
  Settings: settingsModel(sequelize, DataTypes)
}

sequelize.sync()


// SETUP WEB SERVER


const app = express();
app.use(express.json())
app.use(cors())
app.use(cookieSession({
  name: 'session',
  keys: ['my-secret-key'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


// START SERVER


app.use('/api/v1', apiRoutes(sequelize, models))
app.use('/api/auth', authRoutes(sequelize))

app.listen(port, () => {
  console.log(`Development API listening on port ${port}`)
})