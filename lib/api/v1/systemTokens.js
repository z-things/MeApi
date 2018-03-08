/**
 * Created by song on 2015/7/7.
 */
'use strict';
var result = require('./model/http-client-response.json');
var uuid = require('node-uuid');
var utilCommon = require('./util/common.js');
var logger = require('../../mlogger/mlogger.js');
var OPERATION_SCHEMAS = {
  post: {
    "type": "object",
    "properties": {
      "phoneNumber": {
        "type": "string"
      },
      "password": {
        "type": "string"
      }
    },
    "additionalProperties": false
  }
};

function SystemTokens(conx) {
  this.post = function (request, callbackRes) {
    conx.messageValidate(request.body, OPERATION_SCHEMAS.post, function (error) {
      var res = JSON.parse(JSON.stringify(result));
      if (error) {
        res.weiwiz.MHome.errorId = error.retCode;
        res.weiwiz.MHome.errorMsg = error.description;
        callbackRes(res);
      }
      else {
        logger.debug(request.body);
        if (!utilCommon.validatePhoneNumber(request.body.phoneNumber)) {
          res.weiwiz.MHome.errorId = 204002;
          callbackRes(res);
        }
        else {
          var cmd = {
            cmdName: "login",
            cmdCode: "0001",
            parameters: {
              "userName": request.body.phoneNumber,
              "password": request.body.password
            }
          };
          utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.authentication_center"), cmd, function (response) {
            res.weiwiz.MHome.errorId = response.retCode;
            res.weiwiz.MHome.errorMsg = response.description;
            if (response.retCode === 200) {
              res.weiwiz.MHome.response = {
                uuid: response.data.token.split("_")[0],
                online: true,
                token: response.data.token
              };
            }
            logger.debug(JSON.stringify(res));
            callbackRes(res);
          });
        }
      }
    });
  }
}

module.exports = SystemTokens;
