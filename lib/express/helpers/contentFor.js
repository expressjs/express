exports = module.exports = function(request, response) {
    var _contentForHelpers = {
        values: {}
    };

    /**
     * Check whether content has been set for a key.
     *
     * Aliased as #has.
     *
     * Examples:
     *
     *     - if (contentFor.exists('sidebar'))
     *       div.sidebar
     *
     * @param {String} key
     * @return {true, false} whether content has been set for key.
     * @api public
     */
    _contentForHelpers.exists = function(key) {
        return _contentForHelpers.values.hasOwnProperty(key);
    };

    /**
     * Get the content for a given key.
     *
     * Examples:
     *
     *     #{ contentFor.get('author') }
     *
     * @param {String} key
     * @return {String} the set content, or the empty String if no content was set.
     * @api public
     */
    _contentForHelpers.get = function(key) {
        return _contentForHelpers.values[key] || '';
    };

    /**
     * Get the content for a given key, setting it to the default
     * provided if no content has yet been set. Subsequent gets to
     * the same key will return the default value. If default is
     * a function, it will be called with the request and response
     * as arguments and the retuned value will be used.
     *
     * Aliased as #yield.
     *
     * Examples:
     *
     *     #{ contentFor.fetch('title', 'My Blog') }
     *
     * @param {String} key
     * @param {String, Function} defaultValue the default value as a String or Function.
     * @return {String} the existing or default value
     * @api public
     */
    _contentForHelpers.fetch = function(key, defaultValue) {
        var self = _contentForHelpers;
        if (!self.exists(key)) {
            self.set(key, defaultValue);
        }
        return self.get(key);
    };

    /**
     * Set content for a given key. Overwrites any existing value.
     * If value is a function, it will be called with the request
     * and response as arguments and the returned value will be used.
     *
     * Examples:
     *
     *     #{ contentFor.set('subtitle', 'Archives') }
     *
     * @param {String} key
     * @param {String, Function} value the new value as a String or Function.
     * @return {String} the empty String.
     * @api public
     */
    _contentForHelpers.set = function(key, value) {
        var self = _contentForHelpers;
        if (value instanceof Function) {
            return self.set(key, value.apply(request, response));
        }
        self.values[key] = value;
        return '';
    }

    /**
     * Add content for a given key. If value is a function, it will be
     * called with the request and response as arguments and the
     * returned value will be appended.
     *
     * Examples:
     *
     *     #{ contentFor.append('sidebar', '<div class="widget">Some Widget</div>') }
     *     #{ contentFor.append('sidebar', '<div class="widget">Another Widget</div>') }
     *
     * @param {String} key
     * @param {String} value the value to append as a String or Function.
     * @return {String} the empty String.
     * @api public
     */
    _contentForHelpers.append = function(key, value) {
        var self = _contentForHelpers;
        if (value instanceof Function) {
            return self.append(key, value.apply(request, response));
        }
        self.values[key] = (self.values[key] || '') + value;
        return '';
    }

    _contentForHelpers.has    = _contentForHelpers.exists;
    _contentForHelpers.yield  = _contentForHelpers.fetch;
    _contentForHelpers.put    = _contentForHelpers.set;

    return _contentForHelpers;
};
