'use strict';

const { createClient } = require('redis');

/**
 * Factory function to create an OnlineTracker instance
 *
 * @param {Object} redisClient - The Redis client instance.
 * @returns {Object} An object with methods for user activity tracking.
 */

function createOnlineTracker(redisClient) {
  // Method to add a user's activity
  async function add(user) {
    const now = Date.now();
    try {
      await redisClient.hSet('online_users', user, now.toString());
    } catch (err) {
      console.error('Error setting user activity:', err);
    }
  }

  // Method to get the list of users active in the last N minutes
  async function last(minutes) {
    const threshold = Date.now() - minutes * 60 * 1000;
    try {
      const users = await redisClient.hGetAll('online_users');
      return Object.entries(users || {}).filter(([_, lastActive]) => {
        return parseInt(lastActive, 10) >= threshold;
      }).map(([id]) => id);
    } catch (err) {
      console.error('Error retrieving active users:', err);
      throw err;
    }
  }

  return {
    add,
    last,
  };
}

// Export the factory function
module.exports = createOnlineTracker;
