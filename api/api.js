import express from 'express';
import seq from 'sequelize'
const { DataTypes, Op } = seq
import Computations from '../src/computations'
import checkLogin from './checkLogin.js'

const apiRoutes = (sequelize, models) => {

    const router = express.Router()

    // helper function : get the library Sequelize object from library name and
    // reference to item in library (settings) table
    const getLibrary = async (libraryName) => {

        // find model in the library (settings) table
        const model = await models.Library.findByPk(libraryName)
        const { key, schema } = model

        // reconstruct sequelize data type object from string representation
        // stored in database
        for (const property in schema) {
            schema[property]['type'] = DataTypes[schema[property]['type']]
        }

        // define library object and create table if not created
        const library = sequelize.define(key, schema, {
            freezeTableName: true,
            tableName: libraryName
        })
        await library.sync()

        return { library, model }

    }

    // TODO streamline error codes

    router.all('/getSettings', checkLogin, async (req, res) => {

        console.log('requesting settings or null if do not exist yet')

        const settings = await models.Settings.findByPk('settings')

        if (settings) res.status(200).send(settings['data'])

        res.status(520).send()

    })

    router.all('/setSettings', checkLogin, async (req, res) => {

        const payload = req.body['payload']

        console.log('updating settings')
        const object = { key: 'settings', data: payload }

        const setting = await models.Settings.findOrCreate(

            {
                where: { key: 'settings' },
                defaults: object
            },
        )

        if (!setting[1]) await models.Settings.update(object, { where: { key: 'settings' } })

        res.status(200).send()

    })

    const DATA_TYPE_MAPS = {
        string: DataTypes.STRING,
        int: DataTypes.INTEGER,
        multiselect: DataTypes.INTEGER
    }

    const DATA_TYPE_STRING_MAPS = {
        string: "STRING",
        int: "INTEGER",
        multiselect: "INTEGER"
    }

    router.all('/createLibrary', async (req, res) => {

        const { name, fields } = req.body
        const libraryDefinition = req.body

        // create database schema

        const schema = Object.fromEntries(fields.map(field => {
            const def = {
                type: DATA_TYPE_MAPS[field.dataType],
                primaryKey: field.primaryKey
            }
            return [field['name'], def]
        }))

        const LibraryModel = sequelize.define(name, schema, {
            freezeTableName: true,
            tableName: name
        })

        // create table

        await LibraryModel.sync()

        // TODO create tables for data types

        // store info in database
        const dbSchema = Object.fromEntries(fields.map(field => {
            const def = {
                type: DATA_TYPE_STRING_MAPS[field.dataType],
                primaryKey: field.primaryKey
            }
            return [field['name'], def]
        }))

        await models.Library.create({ key: name, definition: libraryDefinition, schema: dbSchema })

        res.status(200).send()

    })

    router.all('/getLibraries', checkLogin, async (req, res) => {

        const libraries = await models.Library.findAll({
            attributes: ['definition']
        })

        res.status(200).send(libraries.map(library => library.definition))

    })

    router.all('/getLibrary', async (req, res) => {

        const libraryName = req.body['libraryName']

        const library = await models.Library.findByPk(libraryName)

        if (!library) res.status(404).send()
        else res.status(200).send(library['definition'])

    })

    router.all('/getCell', async (req, res) => {

        const libraryName = req.body['libraryName']
        const cellId = req.body['cellId']

        const { library } = await getLibrary(libraryName)

        const data = await library.findByPk(cellId)

        if (!library) res.status(404).send()
        else res.status(200).send(data)
    })

    router.all('/getLibraryData', async (req, res) => {

        const libraryName = req.body['libraryName']

        const { library } = await getLibrary(libraryName)

        const data = await library.findAll()

        if (!library) res.status(404).send()
        else res.status(200).send(data)

    })


    router.all('/addItemToLibrary', async (req, res) => {

        const libraryName = req.body['libraryName']
        const libraryItem = req.body['libraryItem']

        const { library } = await getLibrary(libraryName)

        // add item to library
        await library.create(libraryItem)

        res.status(200).send()

    })

    router.all('/getFilteredCells', async (req, res) => {
        const libraryName = req.body['libraryName']
        const filters = req.body['filters']


        var where = {}

        // transform filters into usable versions
        for (const filter of filters) {
            if (filter.dataType === 'multiselect') {
                where[filter.name] = { [Op.or]: filter.filter }
            }

            if (filter.dataType === 'int' || filter.dataType === 'string') {
                where[filter.name] = { [Op[filter.filter.operator.value]]: filter.filter.value }
            }
        }

        const { library } = getLibrary(libraryName)
        const data = await library.findAll({ where })

        res.status(200).send(data)
    })


    router.all('/getComputations', async (req, res) => {

        // get from code
        const definitions = Computations.initDefinitions()

        // TODO get from DB

        res.status(200).send(definitions)

    })

    router.all('/getComputation', async (req, res) => {

        const computationName = req.body['computationName']

        // get from code
        const definition = Computations.initDefinition(computationName)

        // TODO get from DB

        if (!definition) res.status(404).send()
        else res.status(200).send(definition)

    })

    router.post('/runComputation', async (req, res) => {

        const computationName = req.body['computationName']
        const computationParams = req.body['computationParams']

        try {
            const output = await Computations.run(computationName, computationParams)
            res.status(200).send(output)
        } catch (e) {
            res.status(500).send(e.message)
        }

    })

    router.post('/deleteLibrary', async (req, res) => {
        const libraryName = req.body['libraryName']

        const { model, library } = await getLibrary(libraryName)
        await library.drop()
        await model.destroy()

        res.status(200).send()

    })

    router.post('/deleteCell', async (req, res) => {
        const libraryName = req.body['libraryName']
        const cellId = req.body['cellId']

        const { library } = await getLibrary(libraryName)

        const cell = await library.findByPk(cellId)
        await cell.destroy()

        res.status(200).send()

    })

    router.post('/runComputationOnLibrary', async (req, res) => {

        const libraryName = req.body['libraryName']
        const computationName = req.body['computationName']
        const computationMaps = req.body['computationMaps']

        const { library } = await getLibrary(libraryName)

        // figure out column names from computation maps
        const attributes = Object.keys(computationMaps).map(key => [computationMaps[key], key])

        // get values from library
        const libraryResults = await library.findAll({
            attributes: attributes
        })

        var final = []

        libraryResults.forEach(async ({ dataValues }) => {
            // run computation
            const output = await Computations.run(computationName, dataValues)

            // add result back to temporary object
            final.push({ input: dataValues, output: output })

        })

        // return results
        res.status(200).send(final)

    })

    return router

}

export default apiRoutes