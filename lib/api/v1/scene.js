/**
 * Created by song on 2015/7/2.
 */
var util = require('util');
var async = require('async');
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var utilCommon = require('./util/common.js');
var OPERATION_SCHEMAS = {
    post: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "mode": {
                "type": "string",
                "enum": ["PARALLEL", "WATERFALL", "SERIES"]
            },
            "name": {
                "type": "string"
            },
            "type": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "notify": {
                "type": "boolean"
            },
            "enable": {
                "type": "boolean"
            },
            "interval": {
                "type": "integer",
                "maximum": 3600,
                "minimum": 0
            },
            "between": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "weekday": {
                "type": "array",
                "items": {
                    "type": "integer",
                    "enum": [0, 1, 2, 3, 4, 5, 6]
                }
            },
            "commands": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "uuid": {
                            "type": "string"
                        },
                        "deviceType": {
                            "type": "string"
                        },
                        "cmd": {
                            "type": "object",
                            "properties": {
                                "cmdCode": {
                                    "type": "string"
                                },
                                "cmdName": {
                                    "type": "string"
                                },
                                "parameters": {
                                    "type": "object",
                                    "properties": {}
                                }
                            },
                            "required": [
                                "cmdCode",
                                "cmdName",
                                "parameters"
                            ]
                        }
                    },
                    "required": [
                        "uuid",
                        "deviceType",
                        "cmd"
                    ]
                }
            }
        },
        "required": [
            "mode",
            "name",
            "type",
            "description",
            "notify",
            "commands"
        ]
    },
    put: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "sceneId": {
                "type": "string"
            },
            "mode": {
                "type": "string",
                "enum": ["PARALLEL", "WATERFALL", "SERIES"]
            },
            "type": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "enable": {
                "type": "boolean"
            },
            "description": {
                "type": "string"
            },
            "notify": {
                "type": "boolean"
            },
            "interval": {
                "type": "integer",
                "maximum": 3600,
                "minimum": 0
            },
            "between": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "weekday": {
                "type": "array",
                "items": {
                    "type": "integer",
                    "enum": [0, 1, 2, 3, 4, 5, 6]
                }
            },
            "commands": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "uuid": {
                            "type": "string"
                        },
                        "deviceType": {
                            "type": "string"
                        },
                        "cmd": {
                            "type": "object",
                            "properties": {
                                "cmdCode": {
                                    "type": "string"
                                },
                                "cmdName": {
                                    "type": "string"
                                },
                                "parameters": {
                                    "type": "object",
                                    "properties": {}
                                }
                            },
                            "additionalProperties": false,
                            "required": [
                                "cmdCode",
                                "cmdName",
                                "parameters"
                            ]
                        }
                    },
                    "additionalProperties": false,
                    "required": [
                        "uuid",
                        "deviceType",
                        "cmd"
                    ]
                }
            }
        },
        "additionalProperties": false,
        "required": [
            "sceneId",
            "mode",
            "name",
            "type",
            "description",
            "notify",
            "commands"
        ]
    }
};
function scene(conx) {
    this.get = function (request, userId, sceneId, callback) {
        var res = JSON.parse(JSON.stringify(result));
        var cmd = {
            cmdName: "get",
            cmdCode: "0001",
            parameters: {
                deviceId: userId,
                sceneId: sceneId
            }
        };
        utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.scene"), cmd, function (response) {
            res.weiwiz.MHome.errorId = response.retCode;
            res.weiwiz.MHome.errorMsg = response.description;
            if (response.retCode === 200) {
                if (sceneId === "*") {
                    res.weiwiz.MHome.response.automatics = response.data;
                    if (util.isNullOrUndefined(res.weiwiz.MHome.response.automatics)) {
                        res.weiwiz.MHome.response.automatics = []
                    }
                }
                else {
                    res.weiwiz.MHome.response.automatic = response.data;
                }
            }
            callback(res);
        });
    };
    this.put = function (request, userId, sceneId, callback) {
        conx.messageValidate(request.body, OPERATION_SCHEMAS.put, function (error) {
            var res = JSON.parse(JSON.stringify(result));
            if (error) {
                res.weiwiz.MHome.errorId = error.retCode;
                res.weiwiz.MHome.errorMsg = error.description;
                callback(res);
            }
            else {
                var cmd = {
                    cmdName: "update",
                    cmdCode: "0002",
                    parameters: {
                        deviceId: userId,
                        sceneId: sceneId,
                        scene: request.body
                    }
                };
                utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.scene"), cmd, function (response) {
                    res.weiwiz.MHome.errorId = response.retCode;
                    res.weiwiz.MHome.errorMsg = response.description;
                    callback(res);
                });
            }
        });
    };
    this.post = function (request, userId, callback) {
        conx.messageValidate(request.body, OPERATION_SCHEMAS.post, function (error) {
            var res = JSON.parse(JSON.stringify(result));
            if (error) {
                res.weiwiz.MHome.errorId = error.retCode;
                res.weiwiz.MHome.errorMsg = error.description;
                callback(res);
            }
            else {
                var cmd = {
                    cmdName: "add",
                    cmdCode: "0004",
                    parameters: {
                        deviceId: userId,
                        scene: request.body
                    }
                };
                utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.scene"), cmd, function (response) {
                    res.weiwiz.MHome.errorId = response.retCode;
                    res.weiwiz.MHome.errorMsg = response.description;
                    if (response.retCode === 200) {
                        res.weiwiz.MHome.response.uuid = response.data;
                    }
                    callback(res);
                });
            }
        });
    };
    this.delete = function (request, userId, sceneId, callback) {
        var res = JSON.parse(JSON.stringify(result));
        var cmd = {
            cmdName: "delete",
            cmdCode: "0003",
            parameters: {
                deviceId: userId,
                sceneId: sceneId
            }
        };
        utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.scene"), cmd, function (response) {
            res.weiwiz.MHome.errorId = response.retCode;
            res.weiwiz.MHome.errorMsg = response.description;
            callback(res);
        });
    };
    this.action = function (request, userId, sceneId, callback) {
        var res = JSON.parse(JSON.stringify(result));
        var cmd = {
            cmdName: "action",
            cmdCode: "0005",
            parameters: {
                deviceId: userId,
                sceneId: sceneId
            }
        };
        utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.scene"), cmd, function (response) {
            res.weiwiz.MHome.errorId = response.retCode;
            res.weiwiz.MHome.errorMsg = response.description;
            callback(res);
        });
    };
    this.settings = function (request, userId, sceneId, callback) {
        var res = JSON.parse(JSON.stringify(result));
        var cmd;
        cmd = {
            cmdName: "settings",
            cmdCode: "0006",
            parameters: {
                deviceId: userId,
                sceneId: sceneId,
                settings: {
                    notify: "ture" === request.query.notify
                }
            }
        };
        utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.scene"), cmd, function (response) {
            logger.debug(response);
            res.weiwiz.MHome.errorId = response.retCode;
            res.weiwiz.MHome.errorMsg = response.description;
            callback(res);
        });
    };
}

module.exports = scene;