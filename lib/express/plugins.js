
// Express - Plugins - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

Object.merge(global, require('express/plugins/hooks'))
Object.merge(global, require('express/plugins/static'))
Object.merge(global, require('express/plugins/flash'))
Object.merge(global, require('express/plugins/cache'))
Object.merge(global, require('express/plugins/cookie'))
Object.merge(global, require('express/plugins/session'))
Object.merge(global, require('express/plugins/logger'))
Object.merge(global, require('express/plugins/content-length'))
Object.merge(global, require('express/plugins/method-override'))
