/**
 * Created by song on 2015/7/2.
 */
'use strict';
var _ = require('lodash');
var util = require('util');
var utilCommon = require('./util/common.js');
var logger = require('../../mlogger/mlogger.js');
var result = require('./model/http-client-response.json');
var async = require('async');

function events(conx) {
  this.getLatest = function (request, userId, token, callback) {
    var res = JSON.parse(JSON.stringify(result));
    logger.debug(res);
    var offset = request.query["offset"];
    if (util.isNullOrUndefined(offset) || offset !== "latest") {
      res.weiwiz.MHome.errorId = 200001;
      res.weiwiz.MHome.errorMsg = " query parameter [offset] error.";
      callback(res);
      return;
    }
    var cmd = {
      cmdName: "getLatestEvent",
      cmdCode: "0002",
      parameters: {
        userUuid: userId
      }
    };
    logger.debug(JSON.stringify(cmd));
    utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.event_center"), cmd,
      function (response) {
        res.weiwiz.MHome.errorId = response.retCode;
        res.weiwiz.MHome.errorMsg = response.description;
        if (response.retCode === 200) {
          if (response.data === null) {
            response.data = [];
          }
          res.weiwiz.MHome.response.events = response.data;
          /* for (var i = 0; i < res.weiwiz.MHome.response.events.length; ++i) {
               res.weiwiz.MHome.response.events[i].time
                   = new Date(res.weiwiz.MHome.response.events[i].timestamp).getTime();
           }*/
        }
        logger.debug(res);
        callback(res);
      });
  };
  this.get = function (request, userId, token, deviceId, callback) {
    var res = JSON.parse(JSON.stringify(result));
    var offset = request.query["offset"];
    var limit = request.query["limit"];
    var forward = request.query["forward"];
    var parameter = {};
    parameter.where =
      [
        {
          key: "userUuid",
          value: userId,
          op: "eq"
        },
        {
          key: "deviceUuid",
          value: deviceId,
          op: "eq"
        }
      ];
    if (!util.isNullOrUndefined(forward)) {
      if (!util.isNullOrUndefined(offset)) {
        if (offset !== "0") {
          parameter.where.push({
            key: "index",
            value: parseInt(offset),
            op: ""
          });
          if (forward === "true") {
            parameter.where.push({
              key: "index",
              value: parseInt(offset),
              op: "lt"
            });
          } else {
            parameter.where.push({
              key: "index",
              value: parseInt(offset),
              op: "gt"
            });
          }
        }
      } else {
        res.weiwiz.MHome.errorId = 200001;
        res.weiwiz.MHome.errorMsg = " query parameter [offset] is required.";
        callback(res);
        return;
      }
    }

    if (limit !== null) {
      parameter.limit = parseInt(limit);
    }
    var cmd = {
      cmdName: "getEvent",
      cmdCode: "0001",
      parameters: parameter
    };
    logger.debug(JSON.stringify(cmd));
    utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.event_center"), cmd,
      function (response) {
        res.weiwiz.MHome.errorId = response.retCode;
        res.weiwiz.MHome.errorMsg = response.description;
        if (response.retCode === 200) {
          if (response.data === null) {
            response.data = [];
          }
          res.weiwiz.MHome.response.events = response.data;
          /*for (var i = 0; i < res.weiwiz.MHome.response.events.length; ++i) {
           res.weiwiz.MHome.response.events[i].time
           = new Date(res.weiwiz.MHome.response.events[i].timestamp).getTime();
           }*/
        }
        callback(res);
      });
  };
  this.post = function (request, callback) {
    var res = _.cloneDeep(result);
    var cmd = {
      cmdName: "save",
      cmdCode: "0001",
      parameters: request.body
    };
    utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.event_source"), cmd,
      function (response) {
        res.weiwiz.MHome.errorId = response.retCode;
        res.weiwiz.MHome.errorMsg = response.description;
        callback(res);
      });
  }
}

module.exports = events;