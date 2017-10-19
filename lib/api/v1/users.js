/**
 * Created by song on 2015/7/2.
 */
var _ = require('util');
var uuid = require('node-uuid');
var async = require('async');
var result = require('./model/http-client-response.json');
var utilCommon = require('./util/common.js');
var mjson = require('./util/mjson.js');
var logger = require('../../mlogger/mlogger.js');
var OPERATION_SCHEMAS = {
    post: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "definitions": {},
        "properties": {
            "type": {
                "properties": {
                    "icon": {
                        "type": "string"
                    },
                    "id": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "required": [
                    "id",
                    "name"
                ],
                "additionalProperties": false,
                "type": "object"
            },
            "extra": {
                "properties": {
                    "email": {
                        "type": "string"
                    },
                    "language": {
                        "type": "string"
                    },
                    "password": {
                        "type": "string"
                    },
                    "phoneNumber": {
                        "type": "string"
                    }
                },
                "required": [
                    "password",
                    "phoneNumber"
                ],
                "additionalProperties": false,
                "type": "object"
            },
            "name": {
                "type": "string"
            }
        },
        "required": [
            "extra"
        ],
        "additionalProperties": false,
        "type": "object"
    },
    put: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "properties": {
            "extra": {
                "properties": {
                    "email": {
                        "type": "string"
                    },
                    "language": {
                        "type": "string"
                    },
                    "phoneNumber": {
                        "type": "string"
                    }
                },
                "additionalProperties": false,
                "type": "object"
            },
            "icon": {
                "type": "string"
            },
            "name": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "type": "object"
    }
};

var filling = function(request, parameter){
    if (_.isNullOrUndefined(parameter.name) || parameter.name === "") {
        var pos = parameter.extra.phoneNumber.indexOf(")");
        parameter.name = parameter.extra.phoneNumber.substr(pos + 1);
    }
    if (_.isNullOrUndefined(parameter.extra.companyName)) {
        parameter.extra.companyName = "weiwiz";
    }
    if (_.isNullOrUndefined(parameter.extra.timeZone)) {
        parameter.extra.timeZone = "0";
    }
    if (_.isNullOrUndefined(parameter.extra.language)) {
        request.body.extra.language = "en";
    }
    if (_.isNullOrUndefined(parameter.type)) {
        request.body.type = {
            id: "060A08000000",
            name: "user",
            icon: ""
        };
    }
    if (_.isNullOrUndefined(parameter.extra.email)) {
        parameter.extra.email = parameter.extra.phoneNumber.toString().replace(/\(.*\)/, "").concat("@weiwiz.com");
    }
    parameter.ipAddress = utilCommon.getClientIP(request);
    parameter.settings = [
        {
            "name": "automatic_update",
            "value": "true"
        },
        {
            "name": "region",
            "value": "Europe"
        },
        {
            "name": "language",
            "value": "en"
        },
        {
            "name": "notify_system",
            "value": "true"
        },
        {
            "name": "notify_scene",
            "value": "true"
        },
        {
            "name": "notify_device",
            "value": "true"
        },
        {
            "name": "no_disturb",
            "value": "false"
        },
        {
            "name": "no_disturb_interval",
            "value": "23:00~07:00"
        }
    ];
    parameter.extra.scenes = [
        {
            "name" : "回家",
            "mode" : "PARALLEL",
            "type" : "0016080B0001",
            "description" : "一切已经为你准备好了",
            "notify" : true,
            "commands" : [],
            "sceneId" : uuid.v4()
        },
        {
            "name" : "离家",
            "mode" : "PARALLEL",
            "type" : "0016080B0002",
            "description" : "你可以关闭家里的灯或者MeBoost",
            "notify" : true,
            "commands" : [],
            "sceneId" : uuid.v4()
        },
        {
            "name" : "起床",
            "mode" : "PARALLEL",
            "type" : "0016080B0003",
            "description" : "您可以打开窗帘，并打开窗户",
            "notify" : true,
            "commands" : [],
            "sceneId" : uuid.v4()
        },
        {
            "name" : "睡觉",
            "mode" : "PARALLEL",
            "type" : "0016080B0004",
            "description" : "安心休息，我会帮你关闭家里的电灯",
            "notify" : true,
            "commands" : [],
            "sceneId" : uuid.v4()
        }
    ];
    return parameter;
};
function Users(conx) {
    this.post = function (request, callback) {
        conx.messageValidate(request.body, OPERATION_SCHEMAS.post, function (error) {
            var res = JSON.parse(JSON.stringify(result));
            var parameter = request.body;
            if (error) {
                res.weiwiz.MHome.errorId = error.retCode;
                res.weiwiz.MHome.errorMsg = error.description;
                callback(res);
            }
            else {
                async.waterfall([
                        function (innerCallback) {
                            var cmd = {
                                cmdName: "getDevice",
                                cmdCode: "0003",
                                parameters: {
                                    "extra.phoneNumber": parameter.extra.phoneNumber
                                }
                            };
                            utilCommon.sendMsg(conx,
                                conx.configurator.getConfRandom("services.device_manager"),
                                cmd,
                                function (response) {
                                    if (response.retCode === 200) {
                                        innerCallback({
                                            errorId: 203002,
                                            errorMsg: "phone number [" + parameter.extra.phoneNumber + "] has already registered"
                                        });
                                    }
                                    else {
                                        innerCallback(null);
                                    }
                                });
                        }
                    ],
                    function (error) {
                        if (error) {
                            res.weiwiz.MHome.errorMsg = error.errorId;
                            res.weiwiz.MHome.errorId = error.errorMsg;
                            callback(res);
                        }
                        else {
                            parameter = filling(request, parameter);
                            var cmd = {
                                cmdName: "addDevice",
                                cmdCode: "0001",
                                parameters: parameter
                            };
                            utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
                                res.weiwiz.MHome.errorMsg = response.description;
                                res.weiwiz.MHome.errorId = response.retCode;
                                callback(res);
                            });
                        }
                    });
            }
        });
    };
    this.get = function (request, userId, token, callback) {
        var res = JSON.parse(JSON.stringify(result));
        utilCommon.getUser(conx, userId,
            function (user) {
                if (user !== null) {
                    res.weiwiz.MHome.errorId = 200;
                    res.weiwiz.MHome.response = {
                        uuid: user.uuid,
                        name: user.name,
                        type: {
                            id: user.type.id,
                            name: user.type.name,
                            icon: user.type.icon
                        },
                        extra: user.extra
                    };
                }
                else {
                    res.weiwiz.MHome.errorId = 203004;
                }
                callback(res);
            });
    };
    this.put = function (request, userId, token, callback) {
        var user = {};
        conx.messageValidate(request.body, OPERATION_SCHEMAS.put, function (error) {
            var res = JSON.parse(JSON.stringify(result));
            if (error) {
                res.weiwiz.MHome.errorId = error.retCode;
                res.weiwiz.MHome.errorMsg = error.description;
                callback(res);
            }
            else {
                mjson.transformJS(request.body, "", user);
                user.uuid = userId;
                var cmd = {
                    cmdName: "deviceUpdate",
                    cmdCode: "0004",
                    parameters: user
                };
                utilCommon.sendMsgSync(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, callback);
            }
        });
    }
}

module.exports = Users;
