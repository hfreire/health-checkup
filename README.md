# A NodeJS health :heart: check facility to check the status :+1::-1: of your modules
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Version](https://img.shields.io/npm/v/health-checkup.svg)](https://www.npmjs.com/package/health-checkup)
[![](https://img.shields.io/github/release/hfreire/health-checkup.svg)](https://github.com/hfreire/health-checkup/releases)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Dependency Status](https://img.shields.io/david/hfreire/health-checkup.svg?style=flat)](https://david-dm.org/hfreire/health-checkup)
[![Downloads](https://img.shields.io/npm/dt/health-checkup.svg)](https://www.npmjs.com/package/health-checkup) 

### Features
* Support for [Bluebird](https://github.com/petkaantonov/bluebird) :bird: promises
* Caches :clock10: check results

### How to install
```
node install health-checkup
```

### How to use
#### Set up health checks that should be performed during a checkup later on
```javascript
const Health = require('health-checkup')

class MyService1 {
  constructor() {
    Health.addCheck('my-service1', () => new Promise((resolve, reject) => {
      const status = this.getStatus()

      if (status !== 'ok') {
        return reject(new Error(`My Service1 status is ${status}`))
      } else {
        return resolve()
      }
    }))
  }
}
```

#### Perform a checkup and retrieve health report
```javascript
Health.checkup()
  .then((report) => {
    console.log(report)
  })
  
//[
//  {
//    "name": "MyService1",
//    "is_healthy": true
//  },
// {
//    "name": "MyService2",
//    "is_healthy": true
//  },
//  {
//    "name": "MyService3",
//    "is_healthy": false,
//    "reason": "Unable to reach remote server."
//  }
//]  
```

### TODO
* Reduce number of dependencies
* Support callbacks

