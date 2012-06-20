module.exports = function (mvc, app, request, response) {
    this._app = app;
    this._request = request;
    this._response = response;
    this._params = request.params;
    this._param = request.param;
    this._query = request.query;
    this._cookies = request.cookies;
    this._partial = response.partial;
    this._redirect = response.redirect;

    this._formats = [];

    this._local = function(name, val){
        this.locals = this.locals || {};
        return undefined === val
            ? this.locals[name]
            : this.locals[name] = val;
    };

    this._locals = this.helpers = function(obj){
        if (obj) {
            for (var key in obj) {
                this.local(key, obj[key]);
            }
        } else {
            return this.locals;
        }
    };

    this._model = function (modelName, moduleName) {
        if (moduleName == undefined) {
            moduleName = request.params.module;
        }

        if (mvc.models[moduleName] == undefined || mvc.models[moduleName][modelName] == undefined) {
            throw new Error('Model ' + modelName + ' does not exist in module ' + moduleName);
        }

        return new mvc.models[moduleName][modelName]();
    }

    this._queryParam = function (name, defaultValue) {
        if (request.query[name] !== undefined) {
            return this.query[name];
        }

        return defaultValue;
    };

    this._url = function (params) {
        var url = '/';

        if (params.module !== undefined && params.module !== app.set('defaultModule') || params.controller !== undefined && params.controller !== app.set('defaultController') || params.action !== undefined && params.action !== app.set('defaultController')) {
            url += (params.module == undefined ? app.set('defaultModule') : params.module);

            if (params.controller !== undefined && params.controller !== app.set('defaultController') || params.action !== undefined && params.action !== app.set('defaultController')) {
                url += '/' + (params.controller == undefined ? app.set('defaultController') : params.controller);

                if (params.action !== undefined && params.action !== app.set('defaultController')) {
                    url += '/' + (params.action ? app.set('defaultAction') : params.action);
                }
            }
        }

        delete params.module;
        delete params.controller;
        delete params.action;

        var qs = require('qs').stringify(params);

        if (qs) {
            url += '?' + qs;
        }

        return url;
    }

    /*this._forward = function (action, controller, module, query) {

    }*/

    //this._template = null;
    //this._layout = null;
}