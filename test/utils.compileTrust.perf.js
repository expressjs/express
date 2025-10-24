'use strict'

const utils = require('../lib/utils')

describe('utils.compileTrust', function () {
  describe('performance', function () {
    it('should use lazy compilation for large IP lists', function (done) {
      // Test with large IP list (10,000 IPs)
      const largeIpList = Array(10000).fill('127.0.0.1').join(',')
      
      // Measure compileTrust time (should be fast with lazy compilation)
      const start = Date.now()
      const trustFn = utils.compileTrust(largeIpList)
      const compileTime = Date.now() - start
      
      // CompileTrust should be fast (< 10ms) with lazy compilation
      if (compileTime > 10) {
        return done(new Error(`compileTrust took ${compileTime}ms, expected < 10ms with lazy compilation`))
      }
      
      // First call should trigger compilation (will be slower)
      const firstCallStart = Date.now()
      const result1 = trustFn('127.0.0.1', 0)
      const firstCallTime = Date.now() - firstCallStart
      
      // Subsequent calls should be fast (cached)
      const secondCallStart = Date.now()
      const result2 = trustFn('192.168.1.1', 0)
      const secondCallTime = Date.now() - secondCallStart
      
      // Verify results
      if (result1 !== true) {
        return done(new Error('Expected first call to return true'))
      }
      if (result2 !== false) {
        return done(new Error('Expected second call to return false'))
      }
      
      // Second call should be much faster than first
      if (secondCallTime >= firstCallTime) {
        return done(new Error(`Second call (${secondCallTime}ms) should be faster than first call (${firstCallTime}ms)`))
      }
      
      console.log(`Performance test results:`)
      console.log(`  compileTrust: ${compileTime}ms (lazy compilation)`)
      console.log(`  First call: ${firstCallTime}ms (compilation + execution)`)
      console.log(`  Second call: ${secondCallTime}ms (cached execution)`)
      console.log(`  Note: proxyaddr.compile() has O(n) complexity, but large lists`)
      console.log(`  can still cause significant startup delays without lazy compilation`)
      
      done()
    })

    it('should work correctly with small IP lists', function (done) {
      // Test with small IP list (should use immediate compilation)
      const smallIpList = '127.0.0.1,192.168.1.1,10.0.0.1'
      
      const trustFn = utils.compileTrust(smallIpList)
      
      // Test various IPs
      if (trustFn('127.0.0.1', 0) !== true) {
        return done(new Error('Expected 127.0.0.1 to be trusted'))
      }
      if (trustFn('192.168.1.1', 0) !== true) {
        return done(new Error('Expected 192.168.1.1 to be trusted'))
      }
      if (trustFn('8.8.8.8', 0) !== false) {
        return done(new Error('Expected 8.8.8.8 to not be trusted'))
      }
      
      done()
    })

    it('should maintain backward compatibility', function (done) {
      // Test all existing functionality still works
      
      // Boolean true
      const trueFn = utils.compileTrust(true)
      if (trueFn() !== true) {
        return done(new Error('Boolean true should return true'))
      }
      
      // Number (hop count)
      const hopFn = utils.compileTrust(2)
      if (hopFn('127.0.0.1', 0) !== true) {
        return done(new Error('Hop count 0 should be trusted'))
      }
      if (hopFn('127.0.0.1', 2) !== false) {
        return done(new Error('Hop count 2 should not be trusted'))
      }
      
      // Function
      const customFn = function() { return 'custom' }
      const returnedFn = utils.compileTrust(customFn)
      if (returnedFn !== customFn) {
        return done(new Error('Custom function should be returned as-is'))
      }
      
      // Array
      const arrayFn = utils.compileTrust(['127.0.0.1', '192.168.1.1'])
      if (arrayFn('127.0.0.1', 0) !== true) {
        return done(new Error('Array IP should be trusted'))
      }
      
      done()
    })
  })
})