/* jshint node: true */

'use strict';

var split = require('split');

module.exports = function jsonStream(input) {
  return input.pipe(split(/\n\*\*\*.+\*\*\*\n/, function(line) {
    try {
      return JSON.parse(line);
    } catch (err) {
      return null;
    }
  }));
};
