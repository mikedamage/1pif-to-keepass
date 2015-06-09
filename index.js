/* jshint node: true */

'use strict';

var _          = require('lodash');
var fs         = require('fs');
var path       = require('path');
var util       = require('util');
var events     = require('events');
var jsonStream = require('./lib/json-stream');

var defaults = {
  output: process.stdout
};

var OnePassConverter = function OnePassConverter(input, options) {

  this.input       = input;
  this.options     = _.assign(defaults, options);
  this.inputStream = fs.createReadStream(this.input);

  events.EventEmitter.call(this);
};

util.inherits(OnePassConverter, events.EventEmitter);

OnePassConverter.prototype.start = function() {
  this.emit('start', this.input, this.options);

  var self        = this;
  this.jsonStream = jsonStream(this.inputStream).on('data', function(data) {
    self.emit('json', data);
  });

  return true;
};

module.exports = OnePassConverter;
