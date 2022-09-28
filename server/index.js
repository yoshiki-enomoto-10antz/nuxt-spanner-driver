'use strict'

import express from 'express'
import spanner from './spanner'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    const query = {
        sql: 'SELECT table_name FROM information_schema.tables WHERE table_catalog = "" and table_schema = ""',
    };
    const [rows] = await spanner.run(query)
    res.send(rows)
})

app.get('/table/:tablename', async (req, res) => {
    const tablename = req.params.tablename
    const query = {
        sql: `SELECT * FROM ${tablename}`
    };
    const [rows] = await spanner.run(query)
    res.send(rows)
})

app.post('/table/:tablename', async (req, res) => {
    const tablename = req.params.tablename
    const table = spanner.table(tablename)
    await table.update([req.body])
        .then(_ => res.send('ok'))
        .catch(e => res.status(500).send(e))
})

app.delete('/table/:tablename', async (req, res) => {
    const tablename = req.params.tablename
    const table = spanner.table(tablename)
    const key = Object.keys(req.body)[0] // 最初がIDのはず
    await table.deleteRows([req.body[key]])
        .then(_ => res.send('ok'))
        .catch(e => res.status(500).send(e))
})

module.exports = app
