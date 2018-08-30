var _ = require('lodash');
var util = require('util');
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var utilCommon = require('./util/common.js');

function serviceAlarmPolicy(conx) {
  this.post = function (request, userId, token, callback) {
    logger.debug(request.body);
    var res = _.cloneDeep(result);
    var cmd = {
      cmdName: "addAlarmPolicy",
      cmdCode: "0001",
      parameters: request.body
    };
    utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.alarm_center"), cmd, function (response) {
      res.weiwiz.MHome.errorId = response.retCode;
      res.weiwiz.MHome.errorMsg = response.description;
      callback(res);
    });
  };
  this.delete = function (request, userId, token, callback) {
    var res = _.cloneDeep(result);
    var cmd = {
      cmdName: "deleteAlarmPolicy",
      cmdCode: "0002",
      parameters: {
        uuid: request.params.policy_uuid
      }
    };
    utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.alarm_center"), cmd, function (response) {
      res.weiwiz.MHome.errorId = response.retCode;
      res.weiwiz.MHome.errorMsg = response.description;
      callback(res);
    });
  };
  this.put = function (request, userId, token, callback) {
    logger.debug(request.body);
    var res = _.cloneDeep(result);
    var cmd = {
      cmdName: "updateAlarmPolicy",
      cmdCode: "0003",
      parameters: request.body
    };
    utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.alarm_center"), cmd, function (response) {
      res.weiwiz.MHome.errorId = response.retCode;
      res.weiwiz.MHome.errorMsg = response.description;
      callback(res);
    });
  };
}

module.exports = serviceAlarmPolicy;