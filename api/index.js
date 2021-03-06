// require = require('esm')(module)

import dotenv from 'dotenv';

import path from 'path'

import express from 'express';
import seq from 'sequelize';
import cors from 'cors';
import cookieSession from 'cookie-session';

import database from './database.js'

import libraryModel from './models/library.js'
import settingsModel from './models/settings.js'
import messagesModel from './models/messages.js'
import computationHistoryModel from './models/computationHistory.js'

import authRoutes from './auth.js'
import apiRoutes from './api.js'
import * as error from './error.ts'
dotenv.config()
const { DataTypes } = seq;

const main = async () => {
  

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
  // TODO move to db file
  const models = {
    Library: libraryModel(sequelize, DataTypes),
    Settings: settingsModel(sequelize, DataTypes),
    Messages: messagesModel(sequelize, DataTypes),
    ComputationHistory: computationHistoryModel(sequelize, DataTypes)
  }

  sequelize.sync()


  // SETUP WEB SERVER


  const app = express();
  app.use(express.json({ limit: '50mb' }))
  app.use(cors())
  app.use(cookieSession({
    name: 'session',
    keys: ['my-secret-key'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))


  // START SERVER


  app.use('/api/auth', authRoutes(sequelize, app))
  app.use('/api/v1', apiRoutes(sequelize, models))
  app.use(error.middleware(models))

  if (process.env.NODE_ENV === 'production') {

    const __dirname = path.resolve()
    app.use(express.static(path.join(__dirname, 'build')))
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'build/index.html'))
    })

  }

  // const __dirname = path.resolve()
  // app.use(express.static(path.join(__dirname, 'resources')))
  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'resources/index.html'))
  // })

  app.listen(port, () => {
    console.log(`API listening on port ${port}`)
  })

}

main()

// export default main