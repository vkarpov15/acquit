/*!
 * Module dependencies.
 */

var _ = require('underscore');

/**
 * A [node-mongodb-native](https://github.com/mongodb/node-mongodb-native)
 * connection implementation.
 *
 * @inherits Connection
 * @api private
 */

function NativeConnection() {
  MongooseConnection.apply(this, arguments);
  this._listening = false;
}

/**
 * Expose the possible connection states.
 *
 * ```
 * var a = b;
 * ```
 *
 * @api public
 */

NativeConnection.prototype.STATES = STATES;