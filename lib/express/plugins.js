
// Express - Plugins - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

Object.merge(global, require('./plugins/hooks'))
Object.merge(global, require('./plugins/static'))
Object.merge(global, require('./plugins/flash'))
Object.merge(global, require('./plugins/cache'))
Object.merge(global, require('./plugins/cookie'))
Object.merge(global, require('./plugins/session'))
Object.merge(global, require('./plugins/logger'))
Object.merge(global, require('./plugins/content-length'))
Object.merge(global, require('./plugins/method-override'))
