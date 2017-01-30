'use strict'

var URL = require('url')
var PATH = require('path')
var FS = require('fs')

require('sepia')
var mkdirp = require('mkdirp')
var sg = require('simple-get')
var async = require('async')

var lastCheckinCount
var expectedCheckinsPerRequest = 25

var cliArgs = process.argv.slice(2)

if (cliArgs[0] === 'help') {
  showHelp()
  process.exit(0)
}

if (cliArgs.length < 1 || cliArgs.length > 2) {
  showHelp()
  process.exit(1)
}

var username = cliArgs[0]
var lastIdSeen = cliArgs[1] || ''

async.doWhilst(function saveCheckins (cb) {
  getCheckinPage(lastIdSeen, function (err, pageBody) {
    if (!err) err = checkResponseBody(pageBody)
    if (err) return cb(err)

    lastIdSeen = pageBody.response.pagination.max_id
    lastCheckinCount = pageBody.response.checkins.count

    var checkins = pageBody.response.checkins.items

    return async.each(checkins, saveCheckin, cb)
  })
}, function doneTest () {
  var moreRecordsToSave = lastCheckinCount === expectedCheckinsPerRequest
  return moreRecordsToSave
}, function onDone (err) {
  if (err) {
    console.error(err)
    return process.exit(1)
  }

  return console.log('OK')
})

function getCheckinPage (maxId, cb) {
  var apiUrl = URL.format({
    protocol: 'https',
    host: 'api.untappd.com',
    pathname: PATH.join('v4', 'user', 'checkins', username),
    query: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      max_id: maxId
    }
  })

  sg.concat({
    url: apiUrl,
    json: true
  }, function (err, res, data) {
    if (err) return cb(err)

    return cb(null, data)
  })
}

function saveCheckin (checkin, cb) {
  var outputFile = PATH.join(
    __dirname,
    'data', username, (new Date(checkin.created_at)).getUTCFullYear() + '',
    checkin.checkin_id + '.json'
  )

  var outputDir = PATH.dirname(outputFile)
  mkdirp(outputDir, function (err) {
    if (err) return cb(err)

    var outputContent = JSON.stringify(checkin)
    return FS.writeFile(outputFile, outputContent, cb)
  })
}

function checkResponseBody (body) {
  if (!body || !body.response) {
    return new Error('unexpected object from api: missing \'response\'')
  }

  if (!body.response.pagination) {
    return new Error('unexpected object from api: missing \'pagination\'')
  }

  if (!body.response.checkins) {
    return new Error('unexpected object from api: missing \'checkins\'')
  }
}

function showHelp () {
  console.log(`
CLIENT_ID=abc123 \\
CLIENT_SECRET=def456 \\
node get-checkins.js username [max_id]
  username: required, ex: 'tphummel'
  max_id: optional, ex: '10094223'
  `)
}
