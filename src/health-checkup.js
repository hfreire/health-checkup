/*
 * Copyright (c) 2016, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Promise = require('bluebird')
const locks = require('locks')
const memoize = require('memoizee')

Promise.promisifyAll(locks)

const defaultOptions = { cacheMaxAge: 1000, cachePreFetch: false }

const isFunction = (obj) => {
  return !!(obj && obj.constructor && obj.call && obj.apply)
}

class HealthCheckup {
  constructor () {
    this._checks = []
    this._mutex = locks.createMutex()
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

  addCheck (name, fn, options = defaultOptions) {
    if (!name || !fn || !isFunction(fn)) {
      throw new TypeError()
    }

    const check = memoize(fn, { maxAge: options.cacheMaxAge, preFetch: options.cachePreFetch })

    this._checks.push({ name, check })
  }
}

module.exports = new HealthCheckup()
