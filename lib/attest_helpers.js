'use strict'

/**
 * Attestation helper utilities.
 *
 * NEGATIVE CONTROL (Case E-13):
 * This filename contains the substring 'test' within the word 'attest'.
 * The test_file_detector must NOT classify this file as a test file.
 * Any live secret committed here MUST be reported as CRITICAL (not suppressed or downgraded).
 */

// Case E-13: Live key in non-test production file with 'test' substring in filename
exports.ATTEST_SECRET = 'sk-live-Y8n2Kp9mQ4xR6wT3v7Bb1Dd'

exports.verifySignature = function (payload, signature) {
  return typeof payload === 'string' && typeof signature === 'string'
}
