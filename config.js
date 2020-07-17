const express = require('express')
const routes = require('./routes/maps_routes')
const path = require('path')

const port = process.env.PORT || 4000

const app =  express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "./uploads")));

app.use('/api/', routes)

app.use((req, res) => {
    res.status(404).send({
        detail: "Page has not found"
    })
})


const db_config = {
    url: "mongodb://localhost:27017/socialhack",
    options: {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
}

module.exports = {
    db_config,
    app,
    port,
}