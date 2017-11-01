/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const _ = require('lodash')
const Promise = require('bluebird')

const locks = Promise.promisifyAll(require('locks'))

const memoize = require('memoizee')

const defaultOptions = {
  memoizee: {
    maxAge: 1000,
    prefetch: false
  }
}

class Health {
  constructor (options = {}) {
    this._checks = []

    this._mutex = locks.createMutex()

    this.configure(options)
  }

  configure (options = {}) {
    this._options = _.defaultsDeep(options, defaultOptions)
  }

  checkup () {
    return this._mutex.lockAsync()
      .then(() => Promise.map(this._checks, ({ name, check }) => {
        return check()
          .then(() => {
            return { name, is_healthy: true }
          })
          .catch((error) => {
            check.delete() // manual clean up since https://github.com/medikoo/memoizee#promise-returning-functions not quite working

            return { name, is_healthy: false, reason: error.message }
          })
      }))
      .finally(() => {
        this._mutex.unlock()
      })
  }

  addCheck (name, fn, options = {}) {
    if (!name || !fn || !_.isFunction(fn)) {
      throw new Error('invalid arguments')
    }

    const check = memoize(fn, _.get(_.defaultsDeep(options, this._options), 'memoizee'))

    this._checks.push({ name, check })
  }
}

module.exports = new Health()
