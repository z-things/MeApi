/**
 * Created by song on 2015/7/2.
 */
'use strict';
var _ = require('util');
var result = require('./model/http-client-response.json');
var utilCommon = require('./util/common.js');
var logger = require('../../mlogger/mlogger.js');
var OPERATION_SCHEMAS = {
  put: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "value": {
        "type": "string"
      }
    },
    "additionalProperties": false,
    "required": [
      "value"
    ]
  }
};

function eventSettings(conx) {
  this.get = function (request, userId, token, settingName, callback) {
    var res = JSON.parse(JSON.stringify(result));
    utilCommon.getUser(conx, userId,
      function (user) {
        if (user !== null) {
          if (settingName === null) {
            res.weiwiz.MHome.errorId = 200;
            res.weiwiz.MHome.response.settings = [];
            if (!_.isNullOrUndefined(user.extra.settings)
              && !_.isNullOrUndefined(user.extra.settings.event)
              && _.isArray(user.extra.settings.event)) {
              res.weiwiz.MHome.response.settings = user.extra.settings.event;
            }
          } else {
            var found = false;
            if (!_.isNullOrUndefined(user.extra.settings)
              && !_.isNullOrUndefined(user.extra.settings.event)
              && _.isArray(user.extra.settings.event)) {
              for (var i = 0, len = user.settings.event.length; i < len; ++i) {
                if (user.extra.settings.event[i].name === settingName) {
                  found = true;
                  res.weiwiz.MHome.errorId = 200;
                  res.weiwiz.MHome.response.name = user.extra.settings.event[i].name;
                  res.weiwiz.MHome.response.value = user.extra.settings.event[i].value;
                  break;
                }
              }
            }
            if (!found) {
              res.weiwiz.MHome.errorId = 200006;
            }
          }
        }
        else {
          res.weiwiz.MHome.errorId = 203004;
        }
        callback(res);
      });
  };

  this.put = function (request, userId, token, settingName, callback) {
    conx.messageValidate(request.body, OPERATION_SCHEMAS.put, function (error) {
      var res = JSON.parse(JSON.stringify(result));
      if (error) {
        res.weiwiz.MHome.errorId = error.retCode;
        res.weiwiz.MHome.errorMsg = error.description;
        callback(res);
      }
      else {
        utilCommon.getUser(conx, userId,
          function (user) {
            if (user !== null) {
              var settings = user.extra.settings;
              var find = false;
              if (!_.isNullOrUndefined(settings)
                && !_.isNullOrUndefined(settings.event)
                && _.isArray(settings.event)) {
                for (var i = 0, len = settings.event.length; i < len; ++i) {
                  if (settings.event[i].name === settingName) {
                    settings.event[i].value = request.body.value;
                    find = true;
                    break;
                  }
                }
              }
              if (!find) {
                if (_.isNullOrUndefined(settings)) {
                  settings = {};
                }
                if (_.isNullOrUndefined(settings.event)) {
                  settings.event = [];
                }
                settings.event.push({name: settingName, value: request.body.value});
              }

              var cmd = {
                cmdName: "deviceUpdate",
                cmdCode: "0004",
                parameters: {
                  "uuid": userId,
                  "extra.settings.event": settings.event
                }
              };
              utilCommon.sendMsgSync(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, callback);
            }
            else {
              res.weiwiz.MHome.errorId = 203004;
              callback(res);
            }
          }
        )
      }
    });
  }
}

module.exports = eventSettings;
