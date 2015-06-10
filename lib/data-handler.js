/* jshint node: true */

'use strict';

var _ = require('lodash');

module.exports = function dataHandler(data) {
  var skip = !data.hasOwnProperty('secureContents') || _.isEmpty(data.secureContents);

  if (skip) return;

  this.entries.push(data);
};
