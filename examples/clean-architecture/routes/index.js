module.exports = function loadRoutes(app){
    //Add here your routes
    app.use('/notes', require('./notes.route'))
}