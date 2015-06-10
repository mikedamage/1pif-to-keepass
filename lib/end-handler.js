/* jshint node: true */

'use strict';

var _       = require('lodash');
var cheerio = require('cheerio');

module.exports = function endHandler() {
  _.forEach(this.entries, function(entry, index) {

  });

  this.emit('end');
};
