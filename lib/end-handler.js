/* jshint node: true */


'use strict';

var _        = require('lodash');
var fs       = require('fs');
var path     = require('path');
var cheerio  = require('cheerio');
var moment   = require('moment');
var Entities = require('html-entities').XmlEntities;
var stringFieldXMLTemplate = _.template(require('../entry.field.string'));
var concealedFieldXMLTemplate = _.template(require('../entry.field.concealed'));

module.exports = function endHandler() {
  var self     = this;
  var entities = new Entities();
  fs.readFile(path.join(__dirname, '..', 'entry.ejs'), function(err, tpl) {
    if (err) throw err;

    var binding, userField, pwField, entryXML;
    var template = _.template(tpl.toString());

    _.forEach(self.entries, function(entry, index) {
      binding = {
        creationTime: moment(entry.createdAt * 1000).format(),
        lastModificationTime: moment(entry.updatedAt * 1000).format(),
        title: entry.title,
        notes: entry.secureContents.hasOwnProperty('notesPlain') ? entry.secureContents.notesPlain : '',
        url: entry.hasOwnProperty('location') ? entry.location : ''
      };
      switch (entry.typeName) {
        case 'webforms.WebForm':
          userField        = _.find(entry.secureContents.fields, function(f) { if (f.value != undefined){ return f.designation === 'username'; }});
          pwField          = _.find(entry.secureContents.fields, function(f) { if (f.value != undefined){ return f.designation === 'password'; }});
          binding.username = userField ? userField.value : '';
          binding.password = pwField ? pwField.value : '';
          break;
        case 'wallet.computer.UnixServer':
          // historyPasswordField          = _.find(entry.secureContents.passwordHistory, function(f) { return f.value != undefined; });
          binding.username = entry.secureContents.username;
          binding.password = entry.secureContents.password;
          binding.url      = entry.secureContents.url;
          break;
        case 'wallet.computer.Database':
          binding.url      = entry.secureContents.hostname;
          binding.username = entry.secureContents.username;
          binding.password = entry.secureContents.password;
          break;
        case 'wallet.onlineservices.Email.v2':
          binding.url      = entry.secureContents.pop_server;
          binding.username = entry.secureContents.pop_username;
          binding.password = entry.secureContents.pop_password;
          break;
        case 'wallet.computer.Router':
          binding.password = entry.secureContents.wireless_password;
          binding.username = '';
          binding.notes    = 'SSID: ' + entry.secureContents.name + '\nAdmin PW: ' + entry.secureContents.password;
          break;
        case 'passwords.Password':
          binding.password = entry.secureContents.password;
          binding.username = '';
          break;
        default:
          binding.username = 'UndealedCauseOfUncategory';
          binding.password = '';
      }

      binding = _.transform(binding, function(result, value, key) {
        if (_.isString(value)) {
          result[key] = entities.encode(value);
        } else {
          result[key] = value;
        }
      });

      // Deal with customized fields
      var sections = entry.secureContents.sections;
      var fieldsXML = "";
      if (sections != undefined ) {
        var section;
        var i;
        for (i=1; i<sections.length; i++) {
          section = sections[i];
          if (section == undefined ){
            continue;
          }
          _.forEach(section.fields,function(field,index){
            var kv = {
              fieldKey: field.t,
              fieldValue: field.v
            };
            var fieldXML;
            var fieldType = field.k;
            switch (fieldType) {
              case 'concealed':
                fieldXML = concealedFieldXMLTemplate(kv);
                break;
              default:
                fieldXML = stringFieldXMLTemplate(kv);
            }
            fieldsXML += fieldXML;
          })
        }
      }
      binding.fields = fieldsXML;

      entryXML = template(binding);
      // cut the objects into <string key value>s.
      self.xml('Group > Group').append(entryXML);
    });

    self.outputStream.end(self.xml.html(), function() {
      self.emit('end');
    });
  });
};
