var https = require('https')
var config = require('./config')

var credentials = config.apiToken 
  ? config.apiToken + ':api_token'
  : config.userName + ':' + config.password


function getTogglOptions() {
  return {
    hostname: 'www.toggl.com',
    port: 443,
    path: '/api/v8',
    auth: credentials,
    header: {
      'Content-type': 'application/json',
    }
  }
}

function handleResponse(callback) {
  return function (res) {
    var data

    res.on('data', function(chunk) {
      data += chunk
    })
    res.on('end', function() {
      if (data.indexOf('{') >= 0) {
        data = JSON.parse( data.slice(data.indexOf('{')) )
      }
      callback(null, data)
    })
  }
}

module.exports.start = function(description, projectId) {
  return function(callback) {

    var now = new Date();
    var duration = Math.floor(now.getTime() / -1000)

    var body = {
      time_entry: {
        description: description,
        start: now.toISOString(),
        duration: duration,
        pid: projectId
      }
    }

    var options = getTogglOptions()
    options.method = 'POST'
    options.path += '/time_entries'
    options.header['Content-Length'] = body.length

    var req = https.request(options, handleResponse(callback));
    // console.log(JSON.stringify(body))
    req.write(JSON.stringify(body))
    req.end();

    req.on('error', function(e) {
      console.error(e);
    })
  }
}

function stop(id) {
  return function(callback) {

    var options = getTogglOptions()
    options.method = 'PUT'
    options.path += ['/time_entries', id, 'stop'].join('/')
    var req = https.request(options, handleResponse(callback))
    req.end()

    req.on('error', function(e) {
      console.error(e)
    })
  }
}
module.exports.stop = stop

module.exports.stopCurrent = function*() {
  var current = yield getCurrent()
  if (current && current.data) {
    return yield stop(current.data.id)
  } else {
    return current
  }
}

function getCurrent() {
  return function(callback) {
    var options = getTogglOptions()
    options.method = 'GET'
    options.path += '/time_entries/current'
    var req = https.request(options, handleResponse(callback))
    req.end()

    req.on('error', function(e) {
      console.error(e)
    })
  }
}
module.exports.getCurrent = getCurrent

