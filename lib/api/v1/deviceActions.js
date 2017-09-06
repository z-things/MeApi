/**
 * Created by song on 2015/7/2.
 */
var result = require('./model/http-client-response.json');
var util = require('util');
var utilCommon = require('./util/common.js');
var async = require('async');
var OPERATION_SCHEMAS = {
    multiPost: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "definitions": {},
        "id": "http://www.microwiz.com.cn/deviceAction_post.json",
        "properties": {
            "devices":{
                "type":"array",
                "items":{
                    "type":"string"
                }
            },
            "command": {
                "id": "/properties/command",
                "properties": {
                    "cmdCode": {
                        "id": "/properties/command/properties/cmdCode",
                        "type": "string"
                    },
                    "cmdName": {
                        "id": "/properties/command/properties/cmdName",
                        "type": "string"
                    },
                    "options": {
                        "id": "/properties/command/properties/options",
                        "items": {
                            "id": "/properties/command/properties/options/items",
                            "type": "string"
                        },
                        "type": "array"
                    },
                    "parameters": {
                        "id": "/properties/command/properties/parameters",
                        "type": ["array", "object"]
                    }
                },
                "required": [
                    "cmdCode",
                    "parameters",
                    "cmdName"
                ],
                "additionalProperties": false,
                "type": "object"
            }
        },
        "required": [
            "devices",
            "command"
        ],
        "additionalProperties": false,
        "type": "object"
    },
    post: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "definitions": {},
        "id": "http://www.microwiz.com.cn/deviceAction_post.json",
        "properties": {
            "command": {
                "id": "/properties/command",
                "properties": {
                    "cmdCode": {
                        "id": "/properties/command/properties/cmdCode",
                        "type": "string"
                    },
                    "cmdName": {
                        "id": "/properties/command/properties/cmdName",
                        "type": "string"
                    },
                    "options": {
                        "id": "/properties/command/properties/options",
                        "items": {
                            "id": "/properties/command/properties/options/items",
                            "type": "string"
                        },
                        "type": "array"
                    },
                    "parameters": {
                        "id": "/properties/command/properties/parameters",
                        "type": ["array", "object"]
                    }
                },
                "required": [
                    "cmdCode",
                    "parameters",
                    "cmdName"
                ],
                "additionalProperties": false,
                "type": "object"
            }
        },
        "required": [
            "command"
        ],
        "additionalProperties": false,
        "type": "object"
    }
};
function deviceActions(conx) {
    this.multiPost = function (request, userId, token,callback) {
        conx.messageValidate(request.body, OPERATION_SCHEMAS.multiPost, function (error) {
            var res = JSON.parse(JSON.stringify(result));
            if (error) {
                res.weiwiz.MHome.errorId = error.retCode;
                res.weiwiz.MHome.errorMsg = error.description;
                callback(res);
            }
            else {
                async.waterfall([
                    function (innerCallback) {
                        async.mapLimit(request.body.devices,
                            request.body.devices.length,
                            function (deviceUuid, callback) {
                                var cmd = {
                                    cmdName: "execute",
                                    cmdCode: "0001",
                                    parameters: {
                                        userUuid: userId,
                                        deviceUuid: deviceUuid,
                                        cmd: request.body.command
                                    }
                                };
                                utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.executor"), cmd, function (response) {
                                    if (response.retCode === 200) {
                                        callback(null, response.data);
                                    }
                                    else {
                                        callback(null, {errorId: response.retCode, errorMsg: response.description});
                                    }
                                });
                            }, function (error, results) {
                                innerCallback(null, results);
                            });
                    }
                ], function (error, result) {
                    if (error) {
                        res.weiwiz.MHome.errorId = error.errorId;
                        res.weiwiz.MHome.errorMsg = error.errorMsg;
                    }
                    else {
                        res.weiwiz.MHome.errorId = 200;
                        res.weiwiz.MHome.response = {
                            cmdName: request.body.command.cmdName,
                            cmdCode: request.body.command.cmdCode,
                            result: result
                        }
                    }
                    if (callback)
                        callback(res);
                });
            }
        });
    };
    this.post = function (request, userId, token, deviceId, callback) {
        conx.messageValidate(request.body, OPERATION_SCHEMAS.post, function (error) {
            var res = JSON.parse(JSON.stringify(result));
            if (error) {
                res.weiwiz.MHome.errorId = error.retCode;
                res.weiwiz.MHome.errorMsg = error.description;
                callback(res);
            }
            else {
                async.waterfall([
                    function (innerCallback) {
                        var cmd = {
                            cmdName: "execute",
                            cmdCode: "0001",
                            parameters: {
                                userUuid: userId,
                                deviceUuid: deviceId,
                                cmd: request.body.command
                            }
                        };
                        utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.executor"), cmd, function (response) {
                            if (response.retCode === 200) {
                                innerCallback(null, response.data);
                            }
                            else {
                                innerCallback({errorId: response.retCode, errorMsg: response.description});
                            }
                        });
                    }
                ], function (error, result) {
                    if (error) {
                        res.weiwiz.MHome.errorId = error.errorId;
                        res.weiwiz.MHome.errorMsg = error.errorMsg;
                    }
                    else {
                        res.weiwiz.MHome.errorId = 200;
                        res.weiwiz.MHome.response = {
                            cmdName: request.body.command.cmdName,
                            cmdCode: request.body.command.cmdCode,
                            result: result
                        }
                    }
                    if (callback)
                        callback(res);
                });
            }
        });
    };
}

module.exports = deviceActions;