// DEPRECATED

import dotenv from 'dotenv';
dotenv.config()

import express from 'express'
import { postgraphile } from 'postgraphile'

import filter from 'postgraphile-plugin-connection-filter'
import many from 'postgraphile-plugin-many-create-update-delete'

const app = express()

app.use(postgraphile(
    process.env.DATABASE_URL,
    "public",
    {
        watchPg: true,
        graphiql: true,
        enhanceGraphiql: true,
        appendPlugins: [many.default || many, filter],
        dynamicJson: true,
        enableCors: true,
        bodySizeLimit: '10MB'
    }
))

app.listen(5000, '0.0.0.0', () => {
    console.log('listening on port 5000')

})