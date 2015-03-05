/*!
 * Module dependencies.
 */

var _ = require('underscore');
var STATES = ['good', 'bad'];

/**
 * A [node-mongodb-native](https://github.com/mongodb/node-mongodb-native)
 * connection implementation.
 *
 * @inherits Connection
 * @api private
 */

function NativeConnection() {
  this._listening = false;
}

/**
 * Expose the possible connection states.
 *
 * ### Examples
 * ```
 * var conn = new NativeConnection();
 * assert.deepEqual(['good', 'bad'], conn.STATES);
 * ```
 *
 * @api public
 */

NativeConnection.prototype.STATES = STATES;

module.exports = NativeConnection;
