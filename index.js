const { db_config, app, port } = require('./config')
const mongoose = require('mongoose')


mongoose.connect(db_config.url, db_config.options, () => {
    console.log("The database has been connected...")
})

module.exports = app.listen(port, () => {
    console.log(`The server has been started on port ${port}...`)
})