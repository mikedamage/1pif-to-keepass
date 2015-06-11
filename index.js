/* jshint node: true */

'use strict';

var _           = require('lodash');
var fs          = require('fs');
var path        = require('path');
var util        = require('util');
var events      = require('events');
var jsonStream  = require('./lib/json-stream');
var cheerio     = require('cheerio');
var dataHandler = require('./lib/data-handler');
var endHandler  = require('./lib/end-handler');

var defaults = {
  output: process.stdout
};

var OnePassConverter = function OnePassConverter(input, options) {

  this.input        = input;
  this.options      = _.assign(defaults, options);
  this.inputStream  = fs.createReadStream(this.input);
  this.outputStream = _.isString(this.options.output) ?
    fs.createWriteStream(this.options.output) : this.options.output;
  this.entries      = [];

  events.EventEmitter.call(this);
};

util.inherits(OnePassConverter, events.EventEmitter);

OnePassConverter.prototype.start = function() {
  this.emit('start', this.input, this.options);

  fs.readFile(path.join(__dirname, 'xml-starter.xml'), _.bind(function(err, xml) {
    if (err) throw err;

    this.xml        = cheerio.load(xml.toString(), { xmlMode: true });
    this.jsonStream = jsonStream(this.inputStream)
      .on('data', _.bind(dataHandler, this))
      .on('end', _.bind(endHandler, this));
  }, this));

  return true;
};

module.exports = OnePassConverter;
