# A health :heart: check facility to check the status :+1::-1: of your modules

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/hfreire/health-checkup.svg?branch=master)](https://travis-ci.org/hfreire/health-checkup)
[![Coverage Status](https://coveralls.io/repos/github/hfreire/health-checkup/badge.svg?branch=master)](https://coveralls.io/github/hfreire/health-checkup?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/hfreire/health-checkup.svg)](https://greenkeeper.io/)
[![](https://img.shields.io/github/release/hfreire/health-checkup.svg)](https://github.com/hfreire/health-checkup/releases)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/health-checkup.svg)](https://www.npmjs.com/package/health-checkup)
[![Downloads](https://img.shields.io/npm/dt/health-checkup.svg)](https://www.npmjs.com/package/health-checkup) 

> One function to check the health status of all your app modules.

### Features
* Cache :clock10: check results (able to set expiration time) :white_check_mark:
* Supports [Bluebird](https://github.com/petkaantonov/bluebird) :bird: promises :white_check_mark:

### How to install
```
npm install health-checkup
```

### How to use

#### Use it in your app
Set up health checks that should be performed during a checkup later on
```javascript
const Health = require('health-checkup')

class MyService {
  constructor () {
    this._status = 'ok'

    Health.addCheck('my-service', () => {
      return Promise.try(() => {
        if (this._status !== 'ok') {
          throw new Error(`My Service status is ${this._status}`)
        }
      })
    })
  }
}
```

Perform a checkup and retrieve health report
```javascript
Health.checkup()
  .then((report) => console.log(report)) 
```

### Used by
* [serverful](https://github.com/hfreire/serverful) - A kickass :muscle: web server :scream_cat: with all the bells :bell: and whistles :sparkles:
