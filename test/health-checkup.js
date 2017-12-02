/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Health', () => {
  let subject

  afterEach(() => td.reset())

  describe('when adding a check', () => {
    beforeEach(() => {
      subject = require('../src/health-checkup')
    })

    afterEach(() => {
      subject._checks = []
    })

    it('should fail if check function is invalid', (done) => {
      try {
        subject.addCheck('my-check', null)
      } catch (error) {
        error.should.be.an.instanceOf(Error)
        error.should.have.property('message', 'invalid arguments')

        done()
      }
    })

    it('should fail if check name is invalid', (done) => {
      const check = () => {}

      try {
        subject.addCheck(null, check)
      } catch (error) {
        error.should.be.an.instanceOf(Error)
        error.should.have.property('message', 'invalid arguments')

        done()
      }
    })
  })

  describe('when having both a healthy and an unhealthy check', () => {
    let healthyCheck
    let unhealthyCheck
    const error = new Error('my-error')

    before(() => {
      healthyCheck = td.function()

      unhealthyCheck = td.function()
    })

    beforeEach(() => {
      td.when(healthyCheck()).thenResolve()

      td.when(unhealthyCheck()).thenReject(error)

      subject = require('../src/health-checkup')
      subject.addCheck('my-healthy-check', healthyCheck)
      subject.addCheck('my-unhealthy-check', unhealthyCheck)
    })

    afterEach(() => {
      subject._checks = []
    })

    it('should resolve a report with two checks', () => {
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
    const error = new Error('my-error')
    let check

    before(() => {
      check = td.function()
    })

    beforeEach(() => {
      td.when(check()).thenReject(error)

      subject = require('../src/health-checkup')
      subject.addCheck('my-check-name', check)
    })

    afterEach(() => {
      subject._checks = []
    })

    it('should not be cached', () => {
      return subject.checkup()
        .catch((_error) => {
          _error.should.be.equal(error)

          return subject.checkup()
            .catch((_error) => {
              _error.should.be.equal(error)
            })
        })
    })
  })

  describe('when having a healthy check', () => {
    let check

    beforeEach(() => {
      check = td.function()
      td.when(check()).thenResolve()

      subject = require('../src/health-checkup')
    })

    afterEach(() => {
      subject._checks = []
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
      subject.addCheck('my-check-name', check, { memoizee: { maxAge: 10 } })

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
