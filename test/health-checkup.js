/*
 * Copyright (c) 2016, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const test = require('blue-tape')
const Promise = require('bluebird')

test('run single health check', (t) => {
  t.plan(3)

  const HealthCheckup = require('../src/health-checkup')

  const check = () => new Promise((resolve) => {
    t.pass('ran health check')

    resolve()
  })

  HealthCheckup.addCheck('check1', check)

  return HealthCheckup.checkup()
    .then(status => {
      t.equal(status.length, 1, 'status report has only 1 check')
      t.equal(status[ 0 ].name, 'check1', 'check has correct name')
    })
})
