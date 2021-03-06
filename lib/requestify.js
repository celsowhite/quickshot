
let axios = require('axios')
let co = require('co')
let _ = require('lodash')
let Promise = require('bluebird')
let { log } = require('./helpers')

let queues = {}

let baseQueue = {

  add: function (target, request) {
    return new Promise((resolve, reject) => {
      this.list.push({target, request, resolve, reject})
      if (!this.isProcessing) {
        this.process()
      }
    })
  },

  process: function () {
    co(function *() {
      this.isProcessing = true
      while (this.list.length > 0) {
        let req = this.list.shift()
        let headroom = this.max - (this.rate + this.inFlight)
        if (headroom <= 0) { headroom = 0 }
        let exponent = (headroom * headroom)
        if (exponent <= 0.9) { exponent = 0.9 }
        let throttle = 500 / exponent

        yield Promise.delay(throttle)
        this.request(req)
      }
      this.isProcessing = false
    }.bind(this)).catch(function (err) {
      console.log(err)
    })
  },

  request: function ({target, request, resolve, reject}) {
    // console.log(`Shopify Request: [${request.method}]${request.url}`)
    co(function *() {
      this.inFlight += 1
      let result
      try {
        result = yield axios(Object.assign({}, request, {url: `${url(target)}${request.url}`}))
      } catch (err) {
        if (err.statusText === 'Too Many Requests') {
          log(`Exceeded Shopify API limit, will retry...`, 'yellow')
          return this.list.unshift({target, request, resolve, reject})
        } else {
          let errorMsg
          if (err.data.errors) {
            errorMsg = err.data.errors
            if (_.isObject(errorMsg)) {
              errorMsg = JSON.stringify(errorMsg)
            }
          } else {
            errorMsg = `Request Failed!: [${err.status}] ${err.statusText}`
          }
          return reject({message: errorMsg, data: request.data})
        }
      }
      this.inFlight -= 1

      if (result.data.errors) {
        return reject(result.data.errors)
      } else {
        let limit = result.headers['x-shopify-shop-api-call-limit']
        limit = limit.split('/')
        this.rate = parseInt(limit[0], 10)
        this.max = parseInt(limit[1], 10)
      }

      return resolve(result.data)
    }.bind(this)).catch(function (err) {
      console.log(err)
    })
  }

}

let createQueue = function () {
  let queue = Object.create(baseQueue)
  queue.isProcessing = false
  queue.inFlight = 0
  queue.rate = 0
  queue.max = 40
  queue.list = []
  return queue
}

let run = function (target, request) {
  // console.log(target)
  let queue
  if (queues[target.domain]) {
    queue = queues[target.domain]
  } else {
    queue = createQueue()
    queues[target.domain] = queue
  }

  return queue.add(target, request)
}

// {
//   // `data` is the response that was provided by the server
//   data: {},
//
//   // `status` is the HTTP status code from the server response
//   status: 200,
//
//   // `statusText` is the HTTP status message from the server response
//   statusText: 'OK',
//
//   // `headers` the headers that the server responded with
//   headers: {},
//
//   // `config` is the config that was provided to `axios` for the request
//   config: {}
// }

let url = function (target) {
  return `https://${target.api_key}:${target.password}@${target.domain}.myshopify.com`
}

module.exports = run
