/**
 * Created by song on 2015/7/2.
 */
var util = require('util');
var nodeUuid = require('node-uuid');
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var async = require('async');
var utilCommon = require('./util/common.js');
var utilTime = require('./util/mtime.js');

function conflictDetection(actionPolicies, newActionPolicy, callback) {
    if (!actionPolicies || actionPolicies.length <= 0) {
        callback(null);
        return;
    }
    if (newActionPolicy.between.length >= 2 && newActionPolicy.commands.length >= 2) {
        if (newActionPolicy.between[0] === newActionPolicy.between[1]) {
            var error = "Conflict with ["
                + newActionPolicy.between[0] + " "
                + newActionPolicy.commands[0].name + ","
                + newActionPolicy.between[1] + " "
                + newActionPolicy.commands[1].name + "]";
            logger.error(205015, error);
            callback({
                errorId: 205015,
                errorMsg: error
            });
            return;
        }
    }
    for (var i = 0; i < actionPolicies.length; i++) {
        var policy = actionPolicies[i].policy;
        if (actionPolicies[i].description === "control flow"
            && policy.commands.length === newActionPolicy.commands.length) {
            var weekConflict = false;
            //先检测周期是否有重叠，如果周期都没有重叠那么就肯定不会产生冲突
            for (var l = 0; l < policy.weekday.length && weekConflict === false; l++) {
                for (var m = 0; m < newActionPolicy.weekday.length; m++) {
                    if (policy.weekday[l] === newActionPolicy.weekday[m]) {
                        weekConflict = true;
                        break;
                    }
                }
            }
            if (weekConflict) {
                if (policy.commands.length === 1) {
                    //如果是单操作那么只要时间点重叠就意味发生冲突
                    if (policy.between[0] === newActionPolicy.between[0]) {
                        //205015
                        var opName = policy.commands[0].name.toUpperCase();
                        var opId = policy.commands[0].id;
                        var option = policy.commands[0].options[0];
                        if (opName === "setMode" && opId === "3102" && option) {
                            opName = option.value;
                        }
                        if (opName !== "OFF") {
                            opName = "OPEN";
                        }
                        else {
                            opName = "CLOSE";
                        }
                        var errorDetail = "Conflict with ["
                            + policy.between[0] + " "
                            + opName + "]";
                        logger.error(205015, errorDetail);
                        callback({
                            errorId: 205015,
                            errorMsg: errorDetail
                        });
                        return;
                    }
                }
                else {//如果是成对操作，那么只要起始时间段发生重叠那么就意味着发生冲突
                    try {
                        var beginArray1 = policy.between[0].split(':');
                        var endArray1 = policy.between[1].split(':');
                        var beginTime1 = parseInt(beginArray1[0], 10) * 3600 + parseInt(beginArray1[1], 10) * 60;
                        var endTime1 = parseInt(endArray1[0], 10) * 3600 + parseInt(endArray1[1], 10) * 60;
                        if (beginTime1 > endTime1) {
                            var temp1 = beginTime1;
                            beginTime1 = endTime1;
                            endTime1 = temp1;
                        }
                        var beginArray2 = newActionPolicy.between[0].split(':');
                        var endArray2 = newActionPolicy.between[1].split(':');
                        var beginTime2 = parseInt(beginArray2[0], 10) * 3600 + parseInt(beginArray2[1], 10) * 60;
                        var endTime2 = parseInt(endArray2[0], 10) * 3600 + parseInt(endArray2[1], 10) * 60;
                        if (beginTime2 > endTime2) {
                            var temp2 = beginTime2;
                            beginTime2 = endTime2;
                            endTime2 = temp2;
                        }
                        if ((beginTime2 >= beginTime1 && beginTime2 <= endTime1)
                            || (beginTime1 >= beginTime2 && beginTime2 <= endTime2)) {
                            var opName0 = policy.commands[0].name.toUpperCase();
                            var opId0 = policy.commands[0].id;
                            var option0 = policy.commands[0].options[0];
                            var opName1 = policy.commands[1].name.toUpperCase();
                            var opId1 = policy.commands[1].id;
                            var option1 = policy.commands[1].options[0];
                            if (opName0 === "setMode" && opId0 === "3102" && option0) {
                                opName0 = option0.value;
                            }
                            if (opName1 === "setMode" && opId1 === "3102" && option1) {
                                opName1 = option1.value;
                            }
                            if (opName0 !== "OFF") {
                                opName0 = "OPEN";
                            }
                            else {
                                opName1 = "CLOSE";
                            }
                            if (opName1 !== "OFF") {
                                opName1 = "OPEN";
                            }
                            else {
                                opName1 = "CLOSE";
                            }
                            var errorDetail1 = "Conflict with ["
                                + policy.between[0] + " "
                                + opName0 + ","
                                + policy.between[1] + " "
                                + opName1 + "]";
                            //logger.error(205015, errorDetail1);
                            callback({
                                errorId: 205015,
                                errorMsg: errorDetail1
                            });
                            return;
                        }
                    }
                    catch (exception) {
                        logger.error(200000, exception.message);
                    }
                }
            }
        }
    }
    callback(null);
}
function Scense(conx) {
    this.get = function (request, userId, token, deviceId, callback) {
        var res = JSON.parse(JSON.stringify(result));
        var cmd = {
            cmdName: "get_timer",
            cmdCode: "0003",
            parameters: {}
        };
        utilCommon.sendMsg(conx, userId, cmd, function (response) {
            if (response.retCode === 200) {
                res.flag = true;
                res.errorId = 200;
                res.response.automatics = response.data;
            }
            callback(res);
        });
    };
    this.getNextTime = function (request, userId, token, deviceId, callback) {
        var res = JSON.parse(JSON.stringify(result));
        utilCommon.getUserTimeZone(conx, userId, function (timeZone) {
            if (timeZone != null) {
                var cmd = {
                    cmdName: "get_timer",
                    cmdCode: "0003",
                    parameters: {}
                };
                utilCommon.sendMsg(conx, userId, cmd, function (response) {
                    if (response.retCode === 200) {
                        res.flag = true;
                        res.errorId = 200;

                        //获取当前时间
                        var now = new Date();
                        utcNow = utilTime.LocalToUTC(now, now.getTimezoneOffset() * 60 * 1000 * -1);

                        //遍历未来7天
                        var nextDay = null;
                        var command = null;
                        var timezoneOffset = null;
                        var policies = [];
                        for (var i = 0; i < 7; ++i) {

                            var day = utilTime.addDate(utcNow, i);

                            //遍历策略，先定位到天
                            for (var j = 0; j < response.data.length; ++j) {

                                //查找时区offset
                                var offset = null;
                                if (response.data[j].timeZoneOffset != null) {
                                    offset = response.data[j].timeZoneOffset;
                                } else {
                                    offset = timeZone.offset;
                                }

                                day = utilTime.UTCToLocal(day, offset);

                                if (response.data[j].enable === false) {
                                    continue;
                                }

                                //判断星期X是否匹配
                                var weeks = response.data[j].weekday;
                                var find = false;

                                if (weeks == null) {
                                    find = true;
                                } else {
                                    if (weeks.length == 0) {
                                        find = true;
                                    } else {
                                        for (var k = 0; k < weeks.length; ++k) {
                                            if (weeks[k] === day.getDay()) {
                                                find = true;
                                                break;
                                            }
                                        }
                                    }
                                }

                                if (find) {
                                    //取最近的点
                                    var localNow = utilTime.UTCToLocal(utcNow, offset);

                                    for (var k = 0; k < response.data[j].between.length; ++k) {

                                        if (response.data[j].commands[k].enable === false) {
                                            continue;
                                        }

                                        var parts = response.data[j].between[k].split(':');
                                        if (parts.length == 2) {
                                            var time = day;
                                            time.setHours(parseInt(parts[0]));
                                            time.setMinutes(parseInt(parts[1]));
                                            time.setSeconds(0);
                                            time.setMilliseconds(0);

                                            if (localNow > time) {
                                                //当前时间已经超过的点，就加一周
                                                time = utilTime.addDate(time, 7);
                                            }

                                            if (nextDay == null || time < nextDay) {
                                                nextDay = new Date(time);
                                                var index = policies.length;
                                                policies[index] = response.data[j];
                                                command = response.data[j].commands[k];
                                                timezoneOffset = response.data[j].timeZoneOffset;
                                            }
                                        }
                                    }

                                }
                            }

                        }

                        if (nextDay != null && command != null) {
                            var offset = null;
                            if (timezoneOffset != null) {
                                offset = timezoneOffset;
                            } else {
                                offset = parseInt(timeZone.offset);
                            }
                            //与APP约定 转回当天以标志是下一周，代码先保留有问题
                            //var localNow = utilTime.UTCToLocal(utcNow, offset);
                            //if (nextDay.getTime() - localNow.getTime() > 7 * 24 * 3600 * 1000) {
                            //nextDay = utilTime.addDate(time, -7);
                            //}
                            res.response.time = utilTime.LocalToUTC(nextDay, offset).getTime();
                            res.response.timestamp = utilTime.toISOString(nextDay, offset);

                            if (command.id === "0001") {
                                res.response.action = "close";
                            } else if (command.id === "0002") {
                                res.response.action = "open";
                            } else if (command.id === "1318") {
                                res.response.action = "discharge";
                            } else if (command.id === "1317") {
                                res.response.action = "charge";
                            } else if (command.id === "3102" && command.parameters.length === 1) {
                                if (command.parameters[0].value === "OFF") {
                                    res.response.action = "close";
                                } else {
                                    res.response.action = "open";
                                }

                            } else {
                                res.response.action = command.name;
                            }
                            logger.warn("123:" + JSON.stringify(res));

                        } else {
                            res.response.time = 0;
                            res.response.timestamp = "";
                            res.response.action = "";

                        }


                        /*
                         if (policies.length > 0 && nextDay != null) {
                         var nextTime = null;
                         var command = null;
                         var timezoneOffset = null;
                         for (var i = 0; i < policies.length; ++i) {

                         for (var j = 0; j < policies[i].between.length; ++j) {

                         if (policies[i].commands[j].enable === false) {
                         continue;
                         }

                         var parts = policies[i].between[j].split(':');
                         if (parts.length == 2) {
                         var time = nextDay;
                         time.setHours(parseInt(parts[0]));
                         time.setMinutes(parseInt(parts[1]));
                         time.setSeconds(0);
                         time.setMilliseconds(0);

                         //判断是否当天
                         var offset = null;
                         if (policies[i].timeZoneOffset != null) {
                         offset = policies[i].timeZoneOffset;
                         } else {
                         offset = timeZone.offset;
                         }

                         var localNow = utilTime.UTCToLocal(utcNow, offset);

                         if (localNow > time)
                         continue;

                         if (nextTime == null || time < nextTime) {
                         nextTime = new Date(time);
                         command = policies[i].commands[j];
                         timezoneOffset = policies[i].timeZoneOffset;
                         }
                         }
                         }
                         }
                         if (nextTime != null && command != null) {
                         var offset = null;
                         if (timezoneOffset != null) {
                         offset = timezoneOffset;
                         } else {
                         offset = parseInt(timeZone.offset);
                         }

                         res.response.time = utilTime.LocalToUTC(nextTime, offset).getTime();
                         res.response.timestamp = utilTime.toISOString(nextTime, offset);

                         if (command.id === "0001") {
                         res.response.action = "close";
                         } else if (command.id === "0002") {
                         res.response.action = "open";
                         } else if (command.id === "1318") {
                         res.response.action = "discharge";
                         } else if (command.id === "1317") {
                         res.response.action = "charge";
                         } else if (command.id === "3102" && command.parameters.length === 1) {
                         if (command.parameters[0].value === "OFF") {
                         res.response.action = "close";
                         } else {
                         res.response.action = "open";
                         }

                         } else {
                         res.response.action = command.name;
                         }


                         } else {
                         res.response.time = 0;
                         res.response.timestamp = "";
                         res.response.action = "";

                         }

                         } else {
                         res.response.time = 0;
                         res.response.timestamp = ""
                         res.response.action = "";
                         }*/

                    } else {
                        res.flag = true;
                        res.errorId = 200;
                        res.response.time = 0;
                        res.response.timestamp = ""
                        res.response.action = "";
                        logger.error(204004, {"info": "M-API getNextTime error: " + response.retCode});
                    }
                    callback(res);
                });

            } else {
                callback(res);
            }

        });
    };
    this.activeAction = function (request, userId, token, deviceId, policy, policyOld, callback) {
        var res = JSON.parse(JSON.stringify(result));
        var parameter = {};
        //1个命令
        if (policy.commands && policy.commands.length === 1) {
            //外层是否变化
            if (policy.enable === policyOld.enable) {
                parameter = {
                    "authToken": token,
                    "deviceUuid": deviceId,
                    "deviceMethod": "activeActionPolicy",
                    "parameters": {
                        policyId: policy.id,
                        commands: [
                            {
                                id: policy.commands[0].id,
                                parameters: policy.commands[0].parameters,
                                enable: policy.commands[0].enable
                            }
                        ]

                    }
                };
            } else {
                parameter = {
                    "authToken": token,
                    "deviceUuid": deviceId,
                    "deviceMethod": "activeActionPolicy",
                    "parameters": {
                        policyId: policy.id,
                        enable: policy.enable,
                        commands: [
                            {
                                id: policy.commands[0].id,
                                parameters: policy.commands[0].parameters,
                                enable: policy.commands[0].enable
                            }
                        ]

                    }
                };
            }


        }
        //2个命令
        else if (policy.commands && policy.commands.length === 2) {
            //外层是否变化
            if (policy.enable === policyOld.enable) {
                parameter = {
                    "authToken": token,
                    "deviceUuid": deviceId,
                    "deviceMethod": "activeActionPolicy",
                    "parameters": {
                        policyId: policy.id,
                        commands: [
                            {
                                id: policy.commands[0].id,
                                parameters: policy.commands[0].parameters,
                                enable: policy.commands[0].enable
                            },
                            {
                                id: policy.commands[1].id,
                                parameters: policy.commands[1].parameters,
                                enable: policy.commands[1].enable
                            }
                        ]
                    }
                };
            } else {
                parameter = {
                    "authToken": token,
                    "deviceUuid": deviceId,
                    "deviceMethod": "activeActionPolicy",
                    "parameters": {
                        policyId: policy.id,
                        enable: policy.enable,
                        commands: [
                            {
                                id: policy.commands[0].id,
                                parameters: policy.commands[0].parameters,
                                enable: policy.commands[0].enable
                            },
                            {
                                id: policy.commands[1].id,
                                parameters: policy.commands[0].parameters,
                                enable: policy.commands[1].enable
                            }
                        ]
                    }
                };
            }


        } else {
            res.flag = false;
            res.errorId = 204004;
            if (callback !== null)
                callback(res, res);
            return;
        }

        logger.debug(JSON.stringify(parameter));

        utilCommon.sendMsg(conx, userId, "sendActionToDevice", parameter,
            function (response) {

                if (response.retCode === 200) {
                    res.flag = true;
                    res.errorId = 204;
                    if (callback !== null)
                        callback(null, res);
                } else {
                    res.flag = false;
                    res.errorId = 204004;
                    if (callback !== null)
                        callback(res, res);
                }
            });
    };
    this.put = function (request, userId, token, deviceId, policyId, callbackRes) {
        var res = JSON.parse(JSON.stringify(result));
        async.waterfall([
            function (callback) {
                var parameter = {
                    "authToken": token,
                    "deviceUuid": deviceId,
                    "deviceMethod": "getActionPolicy",
                    "parameters": {
                        "policyId": policyId
                    }
                };
                utilCommon.sendMsg(conx, userId, "sendActionToDevice", parameter,
                    function (response) {
                        if (response.retCode === 200) {
                            callback(null, response.data[0], res);
                        } else {
                            callback(res, res);
                        }
                    });
            },
            function (policy, res, callback) {
                var policyCopy = JSON.parse(JSON.stringify(request.body));
                policyCopy.enable = policy.enable;
                if (policyCopy.commands && policyCopy.commands.length > 0 &&
                    policy.commands && policy.commands.length > 0)
                    policyCopy.commands[0].enable = policy.commands[0].enable;
                if (policyCopy.commands && policyCopy.commands.length > 1 &&
                    policy.commands && policy.commands.length > 1)
                    policyCopy.commands[1].enable = policy.commands[1].enable;

                //判断除开关之外的属性是否一致
                if (policyCopy.id === policy.id &&
                    policyCopy.name === policy.name &&
                    policyCopy.mode === policy.mode &&
                    policyCopy.interval === policy.interval &&
                    policyCopy.timeZoneOffset === policy.timeZoneOffset &&
                    JSON.stringify(policyCopy.weekday) === JSON.stringify(policy.weekday) &&
                    JSON.stringify(policyCopy.commands) === JSON.stringify(policy.commands) &&
                    JSON.stringify(policyCopy.between) === JSON.stringify(policy.between)
                ) {

                    activeAction(request, userId, token, deviceId, request.body, policy, callback);

                } else {

                    var parameter = {
                        "authToken": token,
                        "deviceUuid": deviceId,
                        "deviceMethod": "updateActionPolicy",
                        "parameters": request.body
                    };

                    utilCommon.sendMsg(conx, userId, "sendActionToDevice", parameter,
                        function (response) {

                            if (response.retCode === 200) {
                                res.flag = true;
                                res.errorId = 204;
                                //activeAction(request, userId, token, deviceId, request.body, policy, callback);
                                callback(res, res);
                            } else {
                                res.flag = false;
                                res.errorId = 204004;
                                callback(res, res);
                            }

                        });
                }
            }
        ], function (err, results) {
            callbackRes(results);
        });
    };
    this.post = function (request, userId, token, deviceId, callback) {
        var res = JSON.parse(JSON.stringify(result));
        var actionPolicy = request.body;
        async.waterfall([
                /*get device info*/
                function (innerCallback) {
                    var cmd = {
                        cmdName: "getDevice",
                        cmdCode: "0003",
                        parameters: {
                            userId: userId,
                            uuid: deviceId
                        }
                    };
                    utilCommon.sendMsg(conx, configurator.getConfRandom("services.device_manager"), cmd, function (response) {
                        if (response.retCode === 200) {
                            innerCallback(null, response.data);
                        } else {
                            innerCallback({errorId: response.retCode, errorMsg: response.description});
                        }
                    });
                },
                //定时器冲突检测
                function (deviceInfo, innerCallback) {
                    conflictDetection(deviceInfo.extra.actionPolicies, actionPolicy, function (error) {
                        if (error) {
                            innerCallback(error);
                        }
                        else {
                            innerCallback(null, deviceInfo);
                        }
                    });
                },
                function (deviceInfo, innerCallback) {
                    var actionPolicy = deviceInfo.extra.actionPolicy;
                    var addFlowMessages = [];
                    if (actionPolicy.interval && actionPolicy.interval > 0) {
                        var flow = [];
                        var addFlowMessage = {
                            cmdName: "addFlow",
                            cmdCode: "0007",
                            parameters: {
                                timeZoneOffset: actionPolicy.timeZoneOffset,
                                enable: actionPolicy.enable,
                                userUuid: deviceInfo.userId,
                                newTimer: {
                                    name: "ActionTimer",
                                    interval: actionPolicy.interval,
                                    between: actionPolicy.between,
                                    weekday: actionPolicy.weekday
                                },
                                mode: actionPolicy.mode,
                                flow: flow
                            }
                        };
                        for (var index1 = 0, len1 = actionPolicy.commands.length; index1 < len1; index1++) {
                            var cmd = actionPolicy.commands[index1];
                            if (deviceInfo.type.id.substr(0, 2) === "04" && !util.isNullOrUndefined(deviceInfo.owner)) {
                                var newCmd = {
                                    deviceUuid: deviceInfo.owner,
                                    cmdName: "forward",
                                    cmdCode: "0001",
                                    parameters: {
                                        uuid: deviceInfo.uuid,
                                        deviceType: deviceInfo.type.id,
                                        cmd: cmd
                                    }
                                };
                                flow.push(newCmd);
                            }
                            else {
                                cmd.deviceUuid = deviceInfo.uuid;
                                flow.push(cmd);
                            }
                        }
                        addFlowMessages.push(addFlowMessage);
                    }
                    else {
                        for (var index = 0, len = actionPolicy.between.length; index < len; ++index) {
                            var flowNode = null;
                            if (deviceInfo.type.id.substr(0, 2) === "04" && !util.isNullOrUndefined(deviceInfo.owner)) {
                                flowNode = {
                                    deviceUuid: deviceInfo.owner,
                                    cmdName: "forward",
                                    cmdCode: "0001",
                                    parameters: {
                                        uuid: deviceInfo.uuid,
                                        deviceType: deviceInfo.type.id,
                                        cmd: actionPolicy.commands[index]
                                    }
                                };
                            }
                            else {
                                flowNode = actionPolicy.commands[index];
                                flowNode.deviceUuid = self.deviceUuid;
                            }

                            var addFlowMessage1 = {
                                cmdName: "addFlow",
                                cmdCode: "0007",
                                parameters: {
                                    timeZoneOffset: actionPolicy.timeZoneOffset,
                                    enable: actionPolicy.commands[index].enable,
                                    userUuid: self.deviceInfo.userId,
                                    newTimer: {
                                        name: actionPolicy.name,
                                        interval: actionPolicy.interval,
                                        between: [actionPolicy.between[index]],
                                        weekday: actionPolicy.weekday
                                    },
                                    mode: actionPolicy.mode,
                                    flow: [flowNode]
                                }
                            };
                            addFlowMessages.push(addFlowMessage1);
                        }
                    }
                    innerCallback(null, addFlowMessages);
                },
                function (addFlowMessages, innerCallback) {
                    var addFlowFunc = function (addFlowMessage, callback) {
                        utilCommon.sendMsg(conx, configurator.getConfRandom("services.flow_manager"), addFlowMessage, function (response) {
                            if (response.retCode === 200) {
                                callback(null, response.data);
                            } else {
                                callback({errorId: response.retCode, errorMsg: response.description});
                            }
                        });
                    };
                    async.map(addFlowMessages, addFlowFunc, function (error, flowIds) {
                        if (error) {
                            /*如在添加流过程中任意一个失败了，那么必须将已添加成功的流清除掉*/
                            flowIds.forEach(function (flowId) {
                                var deleteFlowMessage = {
                                    cmdName: "deleteFlow",
                                    cmdCode: "0002",
                                    parameters: {
                                        userUuid: userId,
                                        flowId: flowId
                                    }
                                };
                                utilCommon.sendMsg(conx, configurator.getConfRandom("services.flow_manager"), deleteFlowMessage, function (response) {
                                    if (response.retCode !== 200) {
                                        logger.error(response.retCode, esponse.description);
                                    }
                                });
                            });
                            innerCallback(error);
                        }
                        else {
                            innerCallback(null, flowIds);
                        }
                    });
                }
            ],
            function (error, flowIds) {
                if (error) {
                    res.flag = false;
                    res.errorId = error.errorId;
                    res.errorMsg = error.errorMsg;
                }
                else {
                    var policyId = nodeUuid.v4();
                    var newActionPolicy = {
                        policyId: policyId,
                        type: "USER-DEFINED",
                        description: "control flow",
                        policy: actionPolicy,
                        flows: flowIds
                    };
                    deviceInfo.extra.actionPolicies.push(newActionPolicy);
                    var cmd = {
                        cmdName: "deviceUpdate",
                        cmdCode: "0004",
                        parameters: {
                            "uuid": deviceInfo.uuid,
                            "extra.actionPolicies": deviceInfo.extra.actionPolicies
                        }
                    };
                    utilCommon.sendMsg(conx, configurator.getConfRandom("services.device_manager"), cmd, function (response) {
                        if (response.retCode !== 200) {
                            logger.error(response.retCode, response.description);
                        }
                    });
                    res.flag = true;
                    res.errorId = 201;
                    res.response.uuids = policyId;
                }
                callback(res);
            });
    };
    this.delete = function (request, userId, token, deviceId, policyId, callback) {
        var res = JSON.parse(JSON.stringify(result));
        async.waterfall([
                /*get device info*/
                function (innerCallback) {
                    var cmd = {
                        cmdName: "getDevice",
                        cmdCode: "0003",
                        parameters: {
                            userId: userId,
                            uuid: deviceId
                        }
                    };
                    utilCommon.sendMsg(conx, configurator.getConfRandom("services.flow_manager"), cmd, function (response) {
                        if (response.retCode === 200) {
                            innerCallback(null, response.data);
                        } else {
                            innerCallback({errorId: response.retCode, errorMsg: response.description});
                        }
                    });
                },
                function (deviceInfo, innerCallback) {
                    var actionPolicies = [];
                    var index = 0;
                    logger.info("deleteActionPolicy.policyId=" + policyId);
                    if (policyId === '*') {
                        if (deviceInfo.extra.actionPolicies) {
                            actionPolicies = JSON.parse(JSON.stringify(deviceInfo.extra.actionPolicies));
                        }
                    }
                    else {
                        for (var length = deviceInfo.extra.actionPolicies.length; index < length; index++) {
                            if (deviceInfo.extra.actionPolicies[index].policyId === policyId) {
                                actionPolicies.push(self.deviceInfo.extra.actionPolicies[index]);
                                break;
                            }
                        }
                        if (actionPolicies.length <= 0) {
                            var logError1 = {
                                errorId: 200007,
                                errorMsg: "no action policy found by given uuid:[" + policyId + "]"
                            };
                            logger.error(200007, "detail: no action policy found by given uuid:[" + policyId + "]");
                            innerCallback(logError1);
                        }
                    }
                    var deletePolicyFunction = function (actionPolicy, callback) {
                        var deleteFlowFunction = function (flow, callback) {
                            var cmd = {
                                cmdName: "deleteFlow",
                                cmdCode: "0002",
                                parameters: {
                                    userUuid: self.deviceInfo.userId,
                                    flowId: flow
                                }
                            };
                            utilCommon.sendMsg(conx, configurator.getConfRandom("services.flow_manager"), cmd, function (response) {
                                if (response.retCode === 200) {
                                    callback(null);
                                } else {
                                    callback({errorId: response.retCode, errorMsg: response.description});
                                }
                            });
                        };
                        logger.info("Delete actionPolicy.flows, device id=" + deviceInfo.uuid, actionPolicy.flows);
                        async.map(actionPolicy.flows, deleteFlowFunction, function (error) {
                            if (error) {
                                //todo
                            }
                            var index = 0;
                            for (var length = deviceInfo.extra.actionPolicies.length; index < length; index++) {
                                if (deviceInfo.extra.actionPolicies[index].policyId === actionPolicy.policyId) {
                                    deviceInfo.extra.actionPolicies.splice(index, 1);
                                    break;
                                }
                            }
                            var cmd = {
                                cmdName: "deviceUpdate",
                                cmdCode: "0004",
                                parameters: {
                                    "uuid": deviceInfo.uuid,
                                    "extra.actionPolicies": deviceInfo.extra.actionPolicies
                                }
                            };
                            utilCommon.sendMsg(conx, configurator.getConfRandom("services.device_manager"), cmd, function (response) {
                                if (response.retCode !== 200) {
                                    logger.error(response.retCode, response.description);
                                }
                                callback(null, actionPolicy.policyId);
                            });
                        });
                    };
                    logger.info("Delete actionPolicy.flows, device id=" + deviceInfo.uuid, actionPolicies);
                    async.map(actionPolicies, deletePolicyFunction, function (error, policyIds) {
                        if (error) {
                            //todo
                        }
                        innerCallback(null, policyIds);
                    });
                }
            ],
            function (error, policyIds) {
                if (error) {
                    res.flag = false;
                    res.errorId = error.errorId;
                    res.errorMsg = error.errorMsg;
                }
                else {
                    res.flag = true;
                    res.errorId = 204;
                }
                callback(res);
            });
    }
}

module.exports = Scense;