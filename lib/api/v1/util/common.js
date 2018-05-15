/**
 * Created by song on 2015/9/9.
 */
var util = require('util');
var result = require('../model/http-client-response.json');
var message = require('../model/virtual-device-request.json');
var logger = require('../../../mlogger/mlogger.js');
var errcodeTransfer = require('./errcodeTrans.json');
var _ = require('lodash');
//从http的request里面提取IP地址
var getClientIP = function (req) {
  var ipAddress;
  var headers = req.headers;
  var forwardedIpsStr = headers["x-real-ip"] || headers["x-forwarded-for"];
  forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress;
  }

  if (ipAddress) {
    if (ipAddress.indexOf(".") !== -1) {
      ipAddress = ipAddress.replace("::ffff:", "");
    }
  }
  return ipAddress;
};

//错误代码转化
var getTransErrorCode = function (model, method, errcode) {
  var defaultErrorCode = errcodeTransfer["defaultErrorCode"];
  var object = {};
  var objectTemp = {};
  var keyArray = [model, method, errcode];
  for (var i = 0; i < keyArray.length; i++) {
    if (i === 0) {
      object = errcodeTransfer[keyArray[i]];
      if (object === undefined || object === null) {
        object = errcodeTransfer["default"];
      }
    } else {
      objectTemp = object;
      object = object[keyArray[i]];
      if (object === undefined || object === null) {
        object = objectTemp["default"];
      }
      if (objectTemp === undefined || objectTemp === null) {
        return defaultErrorCode;
      }
    }
  }
  if (object && object["errorCode"]) {
    return object["errorCode"];
  } else {
    return defaultErrorCode;
  }
};

//发送消息到其他的虚拟设备，并通过callback返回结果到上层
var sendMsg = function (conx, deviceId, command, callback) {
  var msg = JSON.parse(JSON.stringify(message));
  msg.devices = deviceId;
  msg.payload = command;
  var response = {};
  conx.message(msg, function (responseMessage) {
    logger.trace("M-API sendMsg: deviceId=" + deviceId + ", method=" + command.cmdName
      + ", parameter=" + JSON.stringify(command.parameters) + ", response=" + JSON.stringify(responseMessage));
    if (responseMessage.error) {
      response = {
        retCode: 204005,
        description: "Session timeout",
        data: {}
      }
    } else {
      if (responseMessage && responseMessage.retCode === 200) {
        if (responseMessage.data === null) {
          responseMessage.data = {};
        }
        response = responseMessage;
      } else {
        response = responseMessage;
        //response.retCode = getTransErrorCode("", command.cmdName, responseMessage.retCode);
      }
    }

    if (response.retCode !== 200) {
      logger.error(response.retCode, response.description);
    }
    callback(response);
  });

};

//发送消息到其他虚拟设备，直接返回给mexpress
var sendMsgSync = function (conx, deviceId, command, callback) {
  var msg = JSON.parse(JSON.stringify(message));
  msg.devices = deviceId;
  msg.payload = command;
  logger.debug(msg);
  conx.message(msg, function (responseMessage) {
    var res = JSON.parse(JSON.stringify(result));
    logger.debug("M-API sendMsg: deviceId=" + deviceId.toString() + ", method=" + command.cmdName
      + ", parameter=" + JSON.stringify(command.parameters) + ", response=" + JSON.stringify(responseMessage));
    res.weiwiz.MHome.errorId = responseMessage.retCode;
    res.weiwiz.MHome.errorMsg = responseMessage.description;
    if (responseMessage.retCode === 200) {
      res.weiwiz.MHome.response = responseMessage.data;
    }
    callback(res);
  });

};

//根据设备ID，获取设备信息
var getDevice = function (conx, userId, deviceId, callback) {
  var device = null;
  var cmd = {
    cmdName: "getDevice",
    cmdCode: "0003",
    parameters: {
      userId: userId,
      uuid: deviceId
    }
  };
  sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
    if (response.retCode === 200 && util.isArray(response.data)) {
      device = response.data[0];
    } else {
      logger.error(response.retCode, response.description);
    }
    callback(device);
  });
};

//查找某用户下的是否包含某种类型的设备
var deviceIsExist = function (conx, userId, deviceType) {
  var cmd = {
    cmdName: "getDevice",
    cmdCode: "0003",
    parameters: {
      "userId": userId,
      "type.id": deviceType
    }
  };
  sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
    return (
      response.retCode === 200
      && response.data !== null
      && response.data.length
      && response.data.length > 0
    )
  });
};
//获取用户的详细信息
var getUser = function (conx, userId, callback) {
  var user = null;
  var cmd = {
    cmdName: "getDevice",
    cmdCode: "0003",
    parameters: {
      "uuid": userId
    }
  };
  sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
    if (response.retCode === 200 && response.data !== null) {
      user = response.data[0];
    }
    callback(user);
  });
};
//获取某用户下的所有设备
var getDevices = function (conx, userId, callback) {
  var devices = null;
  var cmd = {
    cmdName: "getDevice",
    cmdCode: "0003",
    parameters: {
      "userId": userId
    }
  };
  sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
    if (response.retCode === 200) {
      devices = response.data;
    }
    callback(devices);
  });
};

//获取某用户下的所有设备（包含用户自身）
var getUserDevices = function (conx, userId, callback) {
  var devices = [];
  var cmd = {
    cmdName: "getDevice",
    cmdCode: "0003",
    parameters: {
      "userId": userId
    }
  };
  //get user's devices
  sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
    if (response.retCode === 200 && response.data !== null) {
      devices = response.data;
    }
    //get user
    var cmd = {
      cmdName: "getDevice",
      cmdCode: "0003",
      parameters: {
        "uuid": userId
      }
    };
    sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
      if (response.retCode === 200 && response.data !== null) {
        devices.push(response.data[0]);
      }
      callback(devices);
    });
  });
};
//获取某用户的时区
var getUserTimeZone = function (conx, userId, callback) {
  var data = null;
  var cmd = {
    cmdName: "getDevice",
    cmdCode: "0003",
    parameters: {
      "userId": userId
    }
  };
  //get user's devices
  sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
    if (response.retCode === 200) {
      for (var i = 0; i < response.data.length; ++i) {
        if (response.data[i].extra && response.data[i].extra.coordinate) {
          data = response.data[i].extra.coordinate.timeZone;
          break;
        }
      }
    }
    callback(data);
  });
};

var validatePhoneNumber = function (phoneNumber) {
  var regPhoneNumber = /\(\+([0-9]+)\)/;
  var result = regPhoneNumber.exec(phoneNumber);
  if (!_.isArray(result) || result.length < 2) {
    return false;
  }
  var regSplit = /\)/;
  var result1 = phoneNumber.split(regSplit);
  if (!_.isArray(result) || result.length < 2) {
    return false;
  }
  var phoneNum = result1[1];
  var regionCode = result[1];
  var regx = null;
  if ("86" === regionCode) {
    regx = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
  }
  else if ("44" === regionCode) {
    regx = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
  }
  else {
    return false;
  }
  return regx.test(phoneNum);
};

module.exports = {
  getClientIP: getClientIP,
  sendMsg: sendMsg,
  sendMsgSync: sendMsgSync,
  getDevice: getDevice,
  getUser: getUser,
  getDevices: getDevices,
  getUserDevices: getUserDevices,
  getUserTimeZone: getUserTimeZone,
  deviceIsExist: deviceIsExist,
  validatePhoneNumber: validatePhoneNumber
};

