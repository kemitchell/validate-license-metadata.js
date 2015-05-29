var meta = require('../package');
module.exports = function() {
  throw new Error(meta.name + ' is a command-line script only');
};
