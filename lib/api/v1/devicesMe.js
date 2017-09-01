/**
 * Created by song on 2015/7/2.
 */
var util = require('util');
var result = require('./model/http-client-response.json');
var mjson = require('./util/mjson.js');
var utilCommon = require('./util/common.js');
var logger = require('../../mlogger/mlogger.js');
var OPERATION_SCHEMAS = {
    post: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "definitions": {},
        "properties": {
            "description": {
                "type": "string"
            },
            "extra": {
                "properties": {},
                "type": "object"
            },
            "icon": {
                "type": "string"
            },
            "location": {
                "properties": {
                    "locationId": {
                        "type": "string"
                    },
                    "locationName": {
                        "type": "string"
                    },
                    "locationType": {
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
                "type": "string"
            },
            "owner": {
                "type": "string"
            },
            "status": {
                "properties": {
                    "network": {
                        "type": "string"
                    },
                    "switch": {
                        "type": "string"
                    }
                },
                "required": [
                    "switch",
                    "network"
                ],
                "additionalProperties": false,
                "type": "object"
            },
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
            }
        },
        "required": [
            "name",
            "extra",
            "location",
            "type"
        ],
        "additionalProperties": false,
        "type": "object"
    },
    put: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "definitions": {},
        "properties": {
            "description": {
                "type": "string"
            },
            "extra": {
                "properties": {},
                "type": "object"
            },
            "icon": {
                "type": "string"
            },
            "location": {
                "properties": {
                    "locationId": {
                        "type": "string"
                    },
                    "locationName": {
                        "type": "string"
                    },
                    "locationType": {
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
                "type": "string"
            }
        },
        "type": "object"
    }
};

var addDevice = function (conx, deviceInfo, userId, token, callback) {
    var res = JSON.parse(JSON.stringify(result));
    var cmd = {
        cmdName: "addDevice",
        cmdCode: "0001",
        parameters: deviceInfo
    };
    utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
        res.weiwiz.MHome.errorId = response.retCode;
        res.weiwiz.MHome.errorMsg = response.description;
        if (response.retCode === 200) {
            res.weiwiz.MHome.response = {uuid: response.data.uuid, token: response.data.token};
        }
        callback(res);
    });
};

function devicesMe(conx) {
    this.post = function (request, userId, token, callback) {
        conx.messageValidate(request.body, OPERATION_SCHEMAS.post, function (error) {
            var res = JSON.parse(JSON.stringify(result));
            if (error) {
                res.weiwiz.MHome.errorId = error.retCode;
                res.weiwiz.MHome.errorMsg = error.description;
                callback(res);
            }
            else {
                if (request.body && request.body.type) {
                    if (util.isNullOrUndefined(request.body.owner)) {
                        request.body.owner = userId;
                    }
                    request.body.userId = userId;
                    request.body.ipAddress = utilCommon.getClientIP(request);
                    request.body.deviceIpAddress = request.body.ipAddress;
                    if (util.isNullOrUndefined(request.body.status)) {
                        request.body.status = {
                            "switch": "ON",
                            "network": "CONNECTED"
                        };
                    }
                    if (util.isNullOrUndefined(request.body.extra.items)) {
                        request.body.extra.items = {};
                    }
                    logger.warn(request.body);
                    addDevice(conx, request.body, userId, token, callback);
                }
                else {
                    callback(res);
                }
            }
        });
    };
    this.get = function (request, userId, token, deviceId, deviceType, callback) {
        logger.warn("M-API sendMsg: devicesMe request");
        var res = JSON.parse(JSON.stringify(result));
        var cmd = {
            cmdName: "getDevice",
            cmdCode: "0003",
            parameters: {
                userId: userId
            }
        };
        if (!util.isNullOrUndefined(deviceId)) {
            cmd.parameters.uuid = deviceId;
        }
        if (!util.isNullOrUndefined(deviceType)) {
            cmd.parameters["type.id"] = deviceType;
        }
        utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
            logger.debug(response);
            res.weiwiz.MHome.errorId = response.retCode;
            res.weiwiz.MHome.errorMsg = response.description;
            if (response.retCode === 200) {
                response.data.forEach(function (device) {
                    delete device.configureWhitelist;
                    delete device.discoverWhitelist;
                    delete device.socketid;
                    delete device.token;
                    delete device.deviceGeo;
                    delete device.geo;
                    delete device.myToken;
                    delete device.protocol;
                    delete device.onlineSince;
                    delete device.timestamp;
                    delete device.meshblu;
                    delete device.ipAddress;
                    delete device.deviceIpAddress;
                });
                if (!util.isNullOrUndefined(deviceId)) {
                    res.weiwiz.MHome.response = response.data[0];
                }
                else {
                    res.weiwiz.MHome.response = response.data;
                }

            }
            callback(res);
        });
    };
    this.put = function (request, userId, token, deviceId, callback) {
        conx.messageValidate(request.body, OPERATION_SCHEMAS.put, function (error) {
            if (error) {
                var res = JSON.parse(JSON.stringify(result));
                res.weiwiz.MHome.errorId = error.retCode;
                res.weiwiz.MHome.errorMsg = error.description;
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

module.exports = devicesMe;