
// JSpec - node - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

JSpec
.include({
  name: 'node',
  
  // --- Matchers
  
  matchers : {
    have_enumerable_property: 'actual.propertyIsEnumerable(expected)',
    have_writable_property: 'Object.getOwnPropertyDescriptor(actual, expected).writable === true',
    have_configurable_property: 'Object.getOwnPropertyDescriptor(actual, expected).configurable === true',
    have_keys: 'does(Object.keys(actual), "eql", expected)',
    have_prototype: 'Object.getPrototypeOf(actual) === expected'
  }
})

