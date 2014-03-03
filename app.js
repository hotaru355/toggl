var co = require('co')
var program = require('commander')
var config = require('./config')
var timeEntry = require('./timeEntry')


function run(argv) {
  program
    .version('0.0.1')
    .usage('[ start -d <desc> -p <projectId> || stop [ -i <entryId> | -c ] ]')
    .option('start', 'Start a time entry')
    .option('-d, --entry-desc <desc>', 'description of the time entry')
    .option('-p, --projectId <projectId>', 'project ID of the time entry')
    .option('stop', 'Stop a time entry')
    .option('-i, --entry-id <entryId>', 'ID of time entry')
    .option('-c, --current', 'stop current time entry')
    .parse(argv);

  co(function* () {
    var response = '-none-'

    if (program.start) {
      response = yield timeEntry.start(
        program.entryDesc || config.default.entryDesc,
        program.projectId || config.default.projectId)

    } else if (program.stop) {
      if (program.entryId) {
        response = yield timeEntry.stop(program.entryId)
      } else if (program.current) {
        response = yield timeEntry.stopCurrent()
      }
    }
    console.log('RESPONSE:')
    console.log(response)
  })()
}

run(process.argv)