module.exports = loadRoutes = app => {
    //Add here your routes
    app.use('/note', require('./notes.route'))
}