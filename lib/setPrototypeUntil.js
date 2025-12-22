
function setPrototypeUntil(obj, proto, until) {
  var currentProto = proto;
  until = until || proto;
  var last = Object.getPrototypeOf(until);
  while (currentProto && currentProto !== last) {
    Object.keys(currentProto).forEach(function (key) {
      setPrototypeKey(obj, proto, key, until)
    });
    currentProto = Object.getPrototypeOf(currentProto)
  }
}

function setPrototypeKey(obj, proto, key, until) {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: proto.propertyIsEnumerable(key),
    get: function () {
      var desc = Object.getOwnPropertyDescriptor(until, key)
      if (desc && typeof desc.get === 'function') {
        // property defined with defineGetter, we need to change the `this` of the getter accordingly
        return desc.get.call(obj)
      }
      return proto[key]
    },
    set: function (v) {
      proto[key] = v
    }
  })
}

module.exports = setPrototypeUntil
