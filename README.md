# A health :heart: check facility to check the status :+1::-1: of your modules

[![Build Status](https://travis-ci.org/hfreire/health-checkup.svg?branch=master)](https://travis-ci.org/hfreire/health-checkup)
[![Coverage Status](https://coveralls.io/repos/github/hfreire/health-checkup/badge.svg?branch=master)](https://coveralls.io/github/hfreire/health-checkup?branch=master)
[![](https://img.shields.io/github/release/hfreire/health-checkup.svg)](https://github.com/hfreire/health-checkup/releases)
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

### How to contribute
You can contribute either with code (e.g., new features, bug fixes and documentation) or by [donating 5 EUR](https://paypal.me/hfreire/5). You can read the [contributing guidelines](CONTRIBUTING.md) for instructions on how to contribute with code. 

All donation proceedings will go to the [Sverige för UNHCR](https://sverigeforunhcr.se), a swedish partner of the [UNHCR - The UN Refugee Agency](http://www.unhcr.org), a global organisation dedicated to saving lives, protecting rights and building a better future for refugees, forcibly displaced communities and stateless people.

### Used by
* [serverful](https://github.com/hfreire/serverful) - A kickass :muscle: web server :scream_cat: with all the bells :bell: and whistles :sparkles:

### License
Read the [license](./LICENSE.md) for permissions and limitations.
