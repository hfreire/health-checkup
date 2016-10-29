/*
 * Copyright (c) 2016, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const _ = require('lodash')
const Promise = require('bluebird')
const locks = require('locks')
const memoize = require('memoizee')

Promise.promisifyAll(locks)

const defaultOptions = { cacheMaxAge: 10000, cachePreFetch: true }

class Healthcheck {
  constructor () {
    this._checks = []
    this._mutex = locks.createMutex()
  }

  status () {
    return this._mutex.lockAsync()
      .then(() => Promise.map(this._checks, ({ name, check }) => {
        return check()
          .then(() => {
            return { name, is_healthy: true }
          })
          .catch((error) => {
            return { name, is_healthy: false, reason: error.message }
          })
      }))
      .finally(() => {
        this._mutex.unlock()
      })
  }

  addCheck (name, fn, options = defaultOptions) {
    if (!name || !fn || !_.isFunction(fn)) {
      throw new TypeError()
    }

    const check = memoize(fn, { maxAge: options.cacheMaxAge, preFetch: options.cachePreFetch })

    this._checks.push({ name, check })
  }
}

module.exports = new Healthcheck()
