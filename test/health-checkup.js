/*
 * Copyright (c) 2016, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('health-checkup', () => {
  let subject

  afterEach(() => {
    td.reset()

    delete require.cache[ require.resolve('../src/health-checkup') ]
  })

  describe('when adding a check', () => {
    before(() => {
      subject = require('../src/health-checkup')
    })

    it('should fail if check function is invalid', () => {
      try {
        subject.addCheck('my-check', null)
      } catch (error) {
        error.should.be.an.instanceOf(TypeError)
      }
    })

    it('should fail if check name is invalid', () => {
      const check = () => Promise.resolve()

      try {
        subject.addCheck(null, check)
      } catch (error) {
        error.should.be.an.instanceOf(TypeError)
      }
    })
  })

  describe('when having both a healthy and an unhealthy check', () => {
    let healthyCheck
    let unhealthyCheck
    const error = new Error('my-error')

    before(() => {
      subject = require('../src/health-checkup')
    })

    beforeEach(() => {
      healthyCheck = td.function()
      unhealthyCheck = td.function()

      td.when(healthyCheck()).thenResolve()
      td.when(unhealthyCheck()).thenReject(error)
    })

    it('should resolve a report with two checks', () => {
      const checks = []
      checks.push({ name: 'my-healthy-check', check: healthyCheck })
      checks.push({ name: 'my-unhealthy-check', check: unhealthyCheck })

      checks.forEach(({ name, check }) => {
        subject.addCheck(name, check)
      })

      return subject.checkup()
        .then(report => {
          report.should.have.lengthOf(2)
          report[ 0 ].should.have.property('name', 'my-healthy-check')
          report[ 0 ].should.have.property('is_healthy', true)
          report[ 1 ].should.have.property('name', 'my-unhealthy-check')
          report[ 1 ].should.have.property('is_healthy', false)
          report[ 1 ].should.have.property('reason', error.message)
        })
    })
  })

  describe('when having an unhealthy check', () => {
    before(() => {
      subject = require('../src/health-checkup')
    })

    it('should not be cached', () => {
      const error = new Error('my-error')
      const check = td.function()

      td.when(check()).thenReject(error)

      subject.addCheck('my-check-name', check)

      return subject.checkup()
        .catch(() => {
          return subject.checkup()
            .catch(() => {
              td.verify(check(), { times: 2 })
            })
        })
    })
  })

  describe('when having a healthy check', () => {
    let check

    before(() => {
      subject = require('../src/health-checkup')
    })

    beforeEach(() => {
      check = td.function()
      td.when(check()).thenResolve()
    })

    it('should be cached', () => {
      subject.addCheck('my-check-name', check)

      return subject.checkup()
        .then(() => {
          return subject.checkup()
            .then(() => td.verify(check(), { times: 1 }))
        })
    })

    it('should not be cached more than 10 ms', () => {
      subject.addCheck('my-check-name', check, { cacheMaxAge: 10 })

      return subject.checkup()
        .delay(10)
        .then(() => {
          return subject.checkup()
            .then(() => {
              td.verify(check(), { times: 2 })
            })
        })
    })
  })
})
