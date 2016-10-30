/*
 * Copyright (c) 2016, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Promise = require('bluebird')
const test = require('blue-tape')

test('run single health check', (t) => {
  t.plan(3)

  const Health = require('../src/health-checkup')

  const check = () => new Promise((resolve) => {
    t.pass('ran health check')

    return resolve()
  })

  Health.addCheck('check1', check)

  return Health.checkup()
    .then(report => {
      t.equal(report.length, 1, 'health report has only 1 check')
      t.equal(report[ 0 ].name, 'check1', 'check has correct name')
    })
})

