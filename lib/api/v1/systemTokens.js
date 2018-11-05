/**
 * Created by song on 2015/7/7.
 */
'use strict';
var _ = require('lodash');
var result = require('./model/http-client-response.json');
var utilCommon = require('./util/common.js');
var logger = require('../../mlogger/mlogger.js');
const qiniu = require("qiniu");
const ACCESSKEY = "ZU3UI9gGlxAZV56Mje3YZAVJxMaZSBATZ-555-NX";
const SECRETKEY = "YdQRQsMwrYBdjgASaEkYIQ396LmOUMZh1mjJWN9l";
const BUCKET = "storage4z-things";

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
      var res = _.cloneDeep(result);
      if (error) {
        res.weiwiz.MHome.errorId = error.retCode;
        res.weiwiz.MHome.errorMsg = error.description;
        callbackRes(res);
      }
      else {
        logger.debug(request.body);
        if (!utilCommon.validatePhoneNumber(request.body.phoneNumber)) {
          res.weiwiz.MHome.errorId = 204002;
          res.weiwiz.MHome.errorMsg = logger.getErrorInfo(204002);
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
          logger.debug(cmd);
          utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.authentication_center"), cmd, function (response) {
            logger.debug(response);
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
  };
  this.get = function (request, callbackRes) {
    var res = _.cloneDeep(result);
    var keyToOverwrite = request.params.fileName;
    var options = {
      scope: BUCKET + ":" + keyToOverwrite + ".jpg"
    };
    logger.debug(options);
    try {
      var mac = new qiniu.auth.digest.Mac(ACCESSKEY, SECRETKEY);
      var putPolicy = new qiniu.rs.PutPolicy(options);
      res.weiwiz.MHome.errorId = 200;
      res.weiwiz.MHome.errorMsg = "SUCCESS";
      res.weiwiz.MHome.response = {
        uptoken: putPolicy.uploadToken(mac)
      };
    }
    catch (e) {
      res.weiwiz.MHome.errorId = 200000;
      res.weiwiz.MHome.errorMsg = e.toString();
    }
    logger.debug(res);
    callbackRes(res);
  }

}

module.exports = SystemTokens;
