'use strict'

/**
 * Case E-11: .spec.js Delimited Test File Path Support.
 *
 * Verifies that the path detector recognizes .spec.js as a test file
 * and suppresses mock credentials properly within it.
 */

var assert = require('assert')

var MOCK_SPEC_KEY = 'sk_test_mock_spec_1234567890abcdef'

describe('auth.spec.js test suite', function () {
  it('should verify mock key pattern under .spec.js convention', function () {
    assert(MOCK_SPEC_KEY.startsWith('sk_test_'))
  })
})
