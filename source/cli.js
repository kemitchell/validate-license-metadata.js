var docopt = require('docopt');
var fs = require('fs');
var path = require('path');
var spdx = require('spdx');

var meta = require('../package');
var usage = fs.readFileSync(path.join(__dirname, 'usage')).toString();

module.exports = function(stdin, stdout, stderr, env, argv, callback) {
  var options;
  try {
    options = docopt.docopt(usage, {
      argv: argv,
      help: false,
      exit: false
    });
  } catch (error) {
    stderr.write(error.message + '\n');
    callback(1);
    return;
  }
  if (options['--version'] || options['-v']) {
    stdout.write(meta.name + ' ' + meta.version + '\n');
    callback(0);
  } else if (options['--help'] || options['-h']) {
    stdout.write(usage + '\n');
    callback(0);
  } else {
    var pj;
    try {
      pj = require(path.join(process.cwd(), 'package.json'));
    } catch (e) {
      console.error('No package.json file found.');
      process.exit(1);
      return;
    }
    var license = pj.license;
    if (!license) {
      console.log('Missing license property in package.json');
      process.exit(1);
      return;
    }
    var valid = (
      license === 'LicenseRef-LICENSE' || spdx.valid(license) !== null
    );
    if (!valid) {
      console.error('Invalid license metadata in package.json');
    }
    process.exit(valid ? 0 : 1);
  }
};
