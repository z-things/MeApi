/**
 * Created by song on 2015/7/7.
 */
var util = require('util');
var result = require('./model/http-client-response.json');
var uuid = require('node-uuid');
var async = require('async');
var USER_TYPE_ID = '060A08000000';
var utilCommon = require('./util/common.js');
var logger = require('../../mlogger/mlogger.js');
var OPERATION_SCHEMAS = {
    post: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "password": {
                "type": "string"
            },
            "old_password": {
                "type": "string"
            },
            "captcha": {
                "type": "string"
            }
        },
        "required": [
            "password"
        ],
        "additionalProperties": false
    }
};

function UserForgot(conx) {
    this.captchaMap = {};
    this.post = function (request, userId, token, callback) {
        var self = this;
        conx.messageValidate(request.body, OPERATION_SCHEMAS.post, function (error) {
            var res = JSON.parse(JSON.stringify(result));
            if (error) {
                res.weiwiz.MHome.errorId = error.retCode;
                res.weiwiz.MHome.errorMsg = error.description;
                callback(res);
            }
            else {
                async.series([
                        function (innerCallback) {
                            if (!util.isNullOrUndefined(request.body.old_password)) {
                                utilCommon.getUser(conx, userId, function (user) {
                                        if (user !== null) {
                                            logger.debug(user.extra.password);
                                            logger.debug(request.body.old_password);
                                            if (user.extra.password !== request.body.old_password) {
                                                innerCallback({
                                                    errorId: 204009,
                                                    errorMsg: "the old password is incorrect."
                                                });
                                            }
                                            else {
                                                innerCallback("break");
                                            }
                                        }
                                        else {
                                            innerCallback({errorId: 203004, errorMsg: "can not find the user."});
                                        }
                                    });
                            }
                        },
                        function (innerCallback) {
                            if (util.isNullOrUndefined(self.captchaMap[userId])
                                || self.captchaMap[userId].captcha !== request.body.captcha
                                || self.captchaMap[userId].timestamp + 60 * 1000 < Date.now()) {
                                innerCallback({errorId: 204008, errorMsg: "captcha error."});
                            }
                            else {
                                innerCallback(null);
                            }
                        }
                    ],
                    function (error) {
                        if ( util.isNullOrUndefined(error) && error !== "break") {
                            res.weiwiz.MHome.errorId = error.errorId;
                            res.weiwiz.MHome.errorMsg = error.errorMsg;
                            callback(res);
                        }
                        else {
                            var cmd = {
                                cmdName: "deviceUpdate",
                                cmdCode: "0004",
                                parameters: {
                                    "uuid": userId,
                                    "extra.password": request.body.password
                                }
                            };
                            utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
                                res.weiwiz.MHome.errorId = response.retCode;
                                res.weiwiz.MHome.errorMsg = response.description;
                                callback(res);
                            });
                        }
                    });
            }
        });
    };

    this.get = function (request, phoneNumber, callback) {
        var self = this;
        var res = JSON.parse(JSON.stringify(result));
        if (!utilCommon.validatePhoneNumber(phoneNumber)) {
            res.weiwiz.MHome.errorId = 210104;
            callback(res);
            return;
        }
        var m = 10, n = 1;
        var num = (Math.round(Math.random() * (m - n))).toString() +
            (Math.round(Math.random() * (m - n))).toString() +
            (Math.round(Math.random() * (m - n))).toString() +
            (Math.round(Math.random() * (m - n))).toString();

        async.waterfall([
            function (innerCallback) {
                var cmd = {
                    cmdName: "getDevice",
                    cmdCode: "0003",
                    parameters: {
                        "type.id": USER_TYPE_ID,
                        "extra.phoneNumber": phoneNumber
                    }
                };
                utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
                    if (response.retCode === 200 && response.data.length > 0) {
                        res.weiwiz.MHome.errorId = 200;
                        res.weiwiz.MHome.response = {
                            userId: response.data[0].uuid,
                            captcha: num
                        };
                        innerCallback(null, response.data[0].uuid);
                    } else {
                        res.weiwiz.MHome.errorId = response.retCode;
                        innerCallback(res);
                    }
                });
            },
            function (userId, innerCallback) {
                phoneNumber = phoneNumber.replace("(", "");
                phoneNumber = phoneNumber.replace(")", "");
                var cmd = {
                    cmdName: "sendMessage",
                    cmdCode: "0001",
                    parameters: {
                        sendTo: phoneNumber,
                        conditional: {
                            messageText: "Message from MeHome, please enter " + num + " to verify your account."
                        }
                    }
                };
                utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.sms"), cmd, function (response) {
                    if (response.retCode === 200) {
                        innerCallback(null, res);
                        self.captchaMap[userId] = {
                            captcha: num,
                            timestamp: Date.now()
                        }
                    } else {
                        res.weiwiz.MHome.response = {};
                        res.weiwiz.MHome.errorId = response.retCode;
                        innerCallback(res);
                    }
                });
            }
        ], function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(result);
            }
        });
    }
}
module.exports = UserForgot;
