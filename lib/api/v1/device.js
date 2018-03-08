/**
 * Created by song on 2015/7/2.
 */
'use strict';
var _ = require('lodash');
var result = require('./model/http-client-response.json');
var utilCommon = require('./util/common.js');
var mjson = require('./util/mjson.js');
var logger = require('../../mlogger/mlogger.js');
var async = require('async');
var OPERATION_SCHEMAS = {
  put: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "definitions": {},
    "id": "http://www.microwiz.com.cn/deviceMe_put.json",
    "properties": {
      "description": {
        "id": "/properties/description",
        "type": "string"
      },
      "extra": {
        "id": "/properties/extra",
        "properties": {},
        "type": "object"
      },
      "icon": {
        "id": "/properties/icon",
        "type": "string"
      },
      "location": {
        "id": "/properties/location",
        "properties": {
          "locationId": {
            "id": "/properties/location/properties/locationId",
            "type": "string"
          },
          "locationName": {
            "id": "/properties/location/properties/locationName",
            "type": "string"
          },
          "locationType": {
            "id": "/properties/location/properties/locationType",
            "type": "string"
          }
        },
        "required": [
          "locationName",
          "locationType",
          "locationId"
        ],
        "additionalProperties": false,
        "type": "object"
      },
      "name": {
        "id": "/properties/name",
        "type": "string"
      }
    },
    "type": "object"
  }
};

function device(conx) {
  this.get = function (request, userId, token, deviceId, callback) {
    var res = JSON.parse(JSON.stringify(result));
    var cmd = {
      cmdName: "getDevice",
      cmdCode: "0003",
      parameters: {
        userId: userId,
        uuid: deviceId
      }
    };
    utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
      if (response.retCode === 200) {
        if (response.data.length <= 0) {
          res.flag = false;
          res.errorId = 404;
        }
        else {
          res.flag = true;
          res.errorId = 200;
          res.response = response.data[0];
        }
      } else {
        res.flag = false;
        res.errorId = response.code;
      }
      callback(res);
    });
  };

  this.put = function (request, userId, token, deviceId, callback) {
    conx.messageValidate(request.body, OPERATION_SCHEMAS.put, function (error) {
      if (error) {
        var res = JSON.parse(JSON.stringify(result));
        res.flag = false;
        res.errorMsg = error.description;
        res.errorId = error.retCode;
        callback(res);
      }
      else {
        logger.warn("device update: " + JSON.stringify(request.body));
        var device = {};
        mjson.transformJS(request.body, "", device);
        device.uuid = deviceId;
        device.userId = userId;
        var cmd = {
          cmdName: "deviceUpdate",
          cmdCode: "0004",
          parameters: device
        };
        utilCommon.sendMsgSync(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, callback);
      }
    });
  };

  this.delete = function (request, userId, token, deviceId, callback) {
    logger.warn("delete device :" + deviceId);
    var cmd = {
      cmdName: "deleteDevice",
      cmdCode: "0002",
      parameters: {
        uuid: deviceId
      }
    };
    utilCommon.sendMsgSync(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, callback);
  }
}

module.exports = device;