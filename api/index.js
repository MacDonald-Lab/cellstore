import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import seq from 'sequelize';
const { Sequelize, DataTypes } = seq;
import cors from 'cors';
import cookieSession from 'cookie-session';

import database from './database.js'

import libraryModel from './models/library.js'
import settingsModel from './models/settings.js'

import authRoutes from './auth.js'
import apiRoutes from './api.js'


// GET DATABASE PROPERTIES


const port = 5000
const dbProperties = {
  dbName: 'cellstore_db_test',
  dbUsername: 'postgres',
  dbPassword: '123',
  dbHost: 'localhost',
  dbPort: 5432
}


// ESTABLISH DATABASE CONNECTION


const sequelize = await database(dbProperties)

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