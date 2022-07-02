module.exports = loadRoutes = app => {
    //Add here your routes
    app.use('/notes', require('./notes.route'))
}