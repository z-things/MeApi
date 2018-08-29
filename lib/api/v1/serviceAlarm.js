var util = require('util');
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var utilCommon = require('./util/common.js');

function serviceAlarm(conx) {
  this.post = function (request, userId, token, callback) {
    var res = _.cloneDeep(result);
    res.weiwiz.MHome.errorId = 200;
    res.weiwiz.MHome.errorMsg = "success.";
    callback(res);
  };
  this.delete = function (request, userId, token, callback) {
    var res = _.cloneDeep(result);
    res.weiwiz.MHome.errorId = 200;
    res.weiwiz.MHome.errorMsg = "success.";
    callback(res);
  };
  this.put = function (request, userId, token, callback) {
    var res = _.cloneDeep(result);
    res.weiwiz.MHome.errorId = 200;
    res.weiwiz.MHome.errorMsg = "success.";
    callback(res);
  };
}
module.exports = serviceAlarm;