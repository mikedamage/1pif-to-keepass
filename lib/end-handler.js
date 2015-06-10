/* jshint node: true */

'use strict';

var _       = require('lodash');
var fs      = require('fs');
var path    = require('path');
var cheerio = require('cheerio');
var moment  = require('moment');

module.exports = function endHandler() {
  fs.readFile(path.join(__dirname, 'entry.ejs'), function(err, tpl) {
    var template = _.template(tpl.toString());

    _.forEach(this.entries, function(entry, index) {

    });

    this.emit('end');
  });
};
