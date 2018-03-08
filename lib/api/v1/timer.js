/**
 * Created by song on 2015/7/2.
 */
'use strict';
var _ = require('lodash');
var util = require('util');
var async = require('async');
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var utilCommon = require('./util/common.js');
var utilTime = require('./util/mtime.js');
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
      "enable": {
        "type": "boolean"
      },
      "interval": {
        "type": "integer",
        "maximum": 59,
        "minimum": 0
      },
      "between": {
        "type": "array",
        "items": {
          "type": "string",
          "pattern": "([01]\\d|2[0-3]):([0-5]\\d)"
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
              "type": ["string", "array"]
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
      "enable",
      "interval",
      "between",
      "commands"
    ]
  },
  put: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "timerId": {
        "type": "string"
      },
      "mode": {
        "type": "string",
        "enum": ["PARALLEL", "WATERFALL", "SERIES"]
      },
      "name": {
        "type": "string"
      },
      "enable": {
        "type": "boolean"
      },
      "index": {
        "type": "integer",
        "minimum": 0
      },
      "interval": {
        "type": "integer",
        "maximum": 59,
        "minimum": 0
      },
      "between": {
        "type": "array",
        "items": {
          "type": "string",
          "pattern": "([01]\\d|2[0-3]):([0-5]\\d)"
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
              "type": ["string", "array"]
            },
            "deviceType": {
              "type": "string"
            },
            "enable": {
              "type": "boolean"
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
      "mode",
      "name",
      "interval",
      "between",
      "commands"
    ]
  },
  active: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "automatic": {
        "type": "object",
        "properties": {
          "enable": {
            "type": "boolean"
          },
          "commands": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "cmdName": {
                  "type": "string"
                },
                "cmdCode": {
                  "type": "string"
                },
                "enable": {
                  "type": "boolean"
                }
              },
              "additionalProperties": false,
              "required": [
                "cmdName",
                "cmdCode",
                "enable"
              ]
            }
          }
        }
      }
    },
    "additionalProperties": false,
    "required": [
      "automatic"
    ]
  }
};
var getUserLanguage = function (conx, userId, callback) {
  utilCommon.getUser(conx, userId,
    function (user) {
      var language = "en";
      if (!util.isNullOrUndefined(user)
        && !util.isNullOrUndefined(user.extra.settings)
        && util.isArray(user.extra.settings)) {
        var index = _.findIndex(user.extra.settings, function (setting) {
          return setting.name === "language";
        });
        language = user.extra.settings[index].value;
        logger.debug(language);
      }
      callback(language);
    });
};
var langStrMap = {
  openStr: {
    en: "OPEN",
    zh: "开启"
  },
  closeStr: {
    en: "CLOSE",
    zh: "关闭"
  },
  weekday0: {
    en: "Sun.",
    zh: "周日"
  },
  weekday1: {
    en: "Mon.",
    zh: "周一"
  },
  weekday2: {
    en: "Tue.",
    zh: "周二"
  },
  weekday3: {
    en: "Wen.",
    zh: "周三"
  },
  weekday4: {
    en: "Thu.",
    zh: "周四"
  },
  weekday5: {
    en: "Fri.",
    zh: "周五"
  },
  weekday6: {
    en: "Sat.",
    zh: "周六"
  },
  workday: {
    en: "workday",
    zh: "工作日"
  },
  weekend: {
    en: "weekend",
    zh: "周末"
  },
  everyday: {
    en: "everyday",
    zh: "每天"
  },
  once: {
    en: "once",
    zh: "执行一次"
  },
  to: {
    en: "to",
    zh: "至"
  }
};
var parse2Abstract = function (timers, lang) {
  var result = [];
  _.forEach(timers, function (timer) {
    var abstract = {
      timerId: timer.timerId,
      actionTime: "",
      actionCycle: "",
      enable: timer.enable,
      detail: timer
    };
    if (_.isArray(timer.between) && 2 <= timer.between.length) {
      if (!_.isEmpty(timer.between[0]) && _.isEmpty(timer.between[1])) {
        abstract.actionTime = timer.between[0] + "--" + langStrMap.openStr[lang];
      }
      else if (_.isEmpty(timer.between[0]) && !_.isEmpty(timer.between[1])) {
        abstract.actionTime = timer.between[1] + "--" + langStrMap.closeStr[lang];
      }
      else if (!_.isEmpty(timer.between[0]) && !_.isEmpty(timer.between[1])) {
        abstract.actionTime = timer.between[0] + "-" + langStrMap.openStr[lang] + "-" + timer.between[1];
      }
    }
    var flag = 0;
    if (_.isArray(timer.weekday)) {
      var preDay = 0;
      var continueCount = 1;
      var weekDayStrAry = [];
      _.forEach(timer.weekday, function (weekday, index) {
        if (0 !== index) {
          if ((preDay + 1) % 7 === weekday) {
            continueCount++;
          }
          else {
            continueCount = 1;
          }
        }
        if (continueCount >= 3) {
          var size = weekDayStrAry.length;
          if (2 <= size) {
            if (langStrMap.to[lang] === weekDayStrAry[size - 2]) {
              weekDayStrAry.pop();
            }
            else {
              weekDayStrAry[size - 1] = langStrMap.to[lang];
            }
          }
        }
        weekDayStrAry.push(langStrMap["weekday" + weekday][lang]);
        flag += 1 << weekday;
        preDay = weekday;
      });
    }
    if (0 === flag) {
      abstract.actionCycle = langStrMap.once[lang];
    }
    else if (127 === flag) { //1111111
      abstract.actionCycle = langStrMap.everyday[lang];
    }
    else if (62 === flag) { //111110
      abstract.actionCycle = langStrMap.workday[lang];
    }
    else if (65 === flag) {//1000001
      abstract.actionCycle = langStrMap.weekend[lang];
    }
    else {
      abstract.actionCycle = _.join(weekDayStrAry, ",");
    }
    result.push(abstract);
  });
  return result;
};

function timer(conx) {
  this.get = function (request, userId, deviceId, timerId, callback) {
    var res = JSON.parse(JSON.stringify(result));
    var cmd = {
      cmdName: "get",
      cmdCode: "0001",
      parameters: {
        userId: userId,
        deviceId: deviceId,
        timerId: timerId
      }
    };
    utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.timer"), cmd, function (response) {
      res.weiwiz.MHome.errorId = response.retCode;
      res.weiwiz.MHome.errorMsg = response.description;
      if (response.retCode === 200) {
        if (timerId === "*") {
          res.weiwiz.MHome.response.automatics = response.data;
          if (util.isNullOrUndefined(res.weiwiz.MHome.response.automatics)) {
            res.weiwiz.MHome.response.automatics = [];
            callback(res);
          }
          else {
            //解析得到定时器概要信息
            getUserLanguage(conx, userId, function (lang) {
              res.weiwiz.MHome.response.automatics = parse2Abstract(response.data, lang);
              callback(res);
            });
          }
        }
        else {
          res.weiwiz.MHome.response.automatic = response.data;
          callback(res);
        }
      }
      else {
        callback(res);
      }
    });
  };
  this.put = function (request, userId, deviceId, timerId, callback) {
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
            userId: userId,
            deviceId: deviceId,
            timerId: timerId,
            timer: request.body
          }
        };
        utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.timer"), cmd, function (response) {
          res.weiwiz.MHome.errorId = response.retCode;
          res.weiwiz.MHome.errorMsg = response.description;
          res.weiwiz.MHome.response = request.body;
          callback(res);
        });
      }
    });
  };
  this.post = function (request, userId, deviceId, callback) {
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
            userId: userId,
            deviceId: deviceId,
            timer: request.body
          }
        };
        utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.timer"), cmd, function (response) {
          res.weiwiz.MHome.errorId = response.retCode;
          res.weiwiz.MHome.errorMsg = response.description;
          res.weiwiz.MHome.response = {uuid: response.data};
          callback(res);
        });
      }
    });

  };
  this.delete = function (request, userId, deviceId, timerId, callback) {
    var res = JSON.parse(JSON.stringify(result));
    var cmd = {
      cmdName: "delete",
      cmdCode: "0003",
      parameters: {
        userId: userId,
        deviceId: deviceId,
        timerId: timerId
      }
    };
    utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.timer"), cmd, function (response) {
      res.weiwiz.MHome.errorId = response.retCode;
      res.weiwiz.MHome.errorMsg = response.description;
      callback(res);
    });
  };
  this.active = function (request, userId, deviceId, timerId, callback) {
    conx.messageValidate(request.body, OPERATION_SCHEMAS.active, function (error) {
      var res = JSON.parse(JSON.stringify(result));
      if (error) {
        res.weiwiz.MHome.errorId = error.retCode;
        res.weiwiz.MHome.errorMsg = error.description;
        callback(res);
      }
      else {
        var cmd = {
          cmdName: "active",
          cmdCode: "0005",
          parameters: {
            userId: userId,
            deviceId: deviceId,
            timerId: timerId,
            automatic: request.body.automatic
          }
        };
        utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.timer"), cmd, function (response) {
          res.weiwiz.MHome.errorId = response.retCode;
          res.weiwiz.MHome.errorMsg = response.description;
          callback(res);
        });
      }
    });

  };
  this.getNextTime = function (request, userId, deviceId, callback) {
    var res = JSON.parse(JSON.stringify(result));
    utilCommon.getUserTimeZone(conx, userId, function (timeZone) {
      if (timeZone !== null) {
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
            var utcNow = utilTime.LocalToUTC(now, now.getTimezoneOffset() * 60 * 1000 * -1);

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
                if (response.data[j].timeZoneOffset !== null) {
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

                if (weeks === null) {
                  find = true;
                } else {
                  if (weeks.length === 0) {
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
                    if (parts.length === 2) {
                      var time = day;
                      time.setHours(parseInt(parts[0]));
                      time.setMinutes(parseInt(parts[1]));
                      time.setSeconds(0);
                      time.setMilliseconds(0);

                      if (localNow > time) {
                        //当前时间已经超过的点，就加一周
                        time = utilTime.addDate(time, 7);
                      }

                      if (nextDay === null || time < nextDay) {
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

            if (nextDay !== null && command !== null) {
              var offset = null;
              if (timezoneOffset !== null) {
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

    })


  };
}

module.exports = timer;