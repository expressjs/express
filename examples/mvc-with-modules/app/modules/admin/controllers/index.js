module.exports = function() {
    this.indexAction = function() {
        var model = this._model('message');
        this._local('info', model.getInfo());
    }
}
