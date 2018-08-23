/**
 * Created by song on 2015/7/2.
 */
'use strict';
var _ = require('lodash');
var util = require('util');
var async = require('async');
var xmlParser = require('xml2js');
var result = require('./model/http-client-response.json');
var mjson = require('./util/mjson.js');
var utilCommon = require('./util/common.js');
var logger = require('../../mlogger/mlogger.js');
const KMJ_LED_TYPE = "05060B052000";
const MODBUS_GATEWAY1_TYPE_ID = '03110B0D0001';
const MODBUS_GATEWAY2_TYPE_ID = '03110B0D0002';
const SOLAR_PLANT_TYPE = "010100000000";
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
    },
    postSynchronize: {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "definitions": {},
      "properties": {
        "mac": {
          "type": "string"
        },
        "model": {
          "type": "string",
          "enum": [
            "ZT-DME02",
            "ZT-DME04"
          ]
        },
        "config": {
          "type": "object",
          "properties": {
            "Device": {
              "type": "object",
              "properties": {
                "$": {
                  "type": "object",
                  "properties": {
                    "DeviceType": {"type": "string"}
                  },
                  "required": ["DeviceType"]
                },
                "ModbusTcpServer": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "$": {
                        "type": "object",
                        "properties": {
                          "Text": {"type": "string"},
                          "Param": {"type": "string"}
                        }
                      },
                      "Propreties": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "Property": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "$": {
                                    "type": "object",
                                    "properties": {
                                      "Name": {"type": "string"},
                                      "Value": {"type": "string"}
                                    },
                                    "required": ["Name", "Value"]
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    "required": ["$", "Propreties"]
                  }
                },
                "Modbus-RTU": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "$": {
                        "type": "object",
                        "properties": {
                          "Text": {"type": "string"},
                          "PortNumber": {"type": "string"}
                        }
                      },
                      "Propreties": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "Property": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "$": {
                                    "type": "object",
                                    "properties": {
                                      "Name": {"type": "string"},
                                      "Value": {"type": "string"}
                                    },
                                    "required": ["Name", "Value"]
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "ModbusRTU-Slave": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "$": {
                              "type": "object",
                              "properties": {
                                "Text": {"type": "string"},
                                "Param": {"type": "string"}
                              }
                            },
                            "Propreties": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "Property": {
                                    "type": "array",
                                    "items": {
                                      "type": "object",
                                      "properties": {
                                        "$": {
                                          "type": "object",
                                          "properties": {
                                            "Name": {"type": "string"},
                                            "Value": {"type": "string"}
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            },
                            "ModbusRTU-Cmd": {
                              "type": "array",
                              "items": {
                                "type": "object"
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                "DLT645": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "$": {
                        "type": "object",
                        "properties": {
                          "Text": {"type": "string"},
                          "PortNumber": {"type": "string"}
                        },
                        "required": ["Text", "PortNumber"]
                      },
                      "Propreties": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "Property": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "$": {
                                    "type": "object",
                                    "properties": {
                                      "Name": {"type": "string"},
                                      "Value": {"type": "string"}
                                    },
                                    "required": ["Name", "Value"]
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "DLT645-Slave": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "$": {
                              "type": "object",
                              "properties": {
                                "Text": {"type": "string"},
                                "Param": {"type": "string"}
                              },
                              "required": ["Text", "Param"]
                            },
                            "Propreties": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "Property": {
                                    "type": "array",
                                    "items": {
                                      "type": "object",
                                      "properties": {
                                        "$": {
                                          "type": "object",
                                          "properties": {
                                            "Name": {"type": "string"},
                                            "Value": {"type": "string"}
                                          },
                                          "required": ["Name", "Value"]
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            },
                            "Dlt645Table": {
                              "type": "array",
                              "items": {
                                "type": "object"
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "required": ["$", "ModbusTcpServer", "Modbus-RTU", "DLT645"]
            }
          },
          "required": ["Device"]
        }
      },
      "required": ["mac", "model", "config"]
    }
  }
;
const MODBUS_DEVICE_SLAVE_RTU_TYPES = [
  "010001000004", "01000C000004",
  "01000D000004", "04110F0F0001"
];
const MODBUS_DEVICE_SLAVE_DLT_TYPES = [
  "04110E0E0001"
];
var sendSOSMessage = function (deviceId, userId, conx) {
  logger.info("sendSOSMessage");
  getDevice(conx, {uuid: deviceId, userId: userId}, function (device) {
    if (device) {
      getDevice(conx, {uuid: userId}, function (user) {
        if (!util.isNullOrUndefined(user)
          && !util.isNullOrUndefined(user.extra)
          && !util.isNullOrUndefined(user.extra.phoneNumber)) {
          var phoneNumber = user.extra.phoneNumber;
          phoneNumber = phoneNumber.substring(phoneNumber.indexOf(")") + 1);
          var sendMsg = {
            cmdName: "sendMessage",
            cmdCode: "0001",
            parameters: {
              PhoneNumbers: phoneNumber,
              SignName: "空明家",
              TemplateCode: "SMS_136165838",
              TemplateParam: "{room:\'" + device.name + "\'}"
            }
          };
          logger.warn(sendMsg);
          var smsService = conx.configurator.getConfRandom("services.ali_sms");
          utilCommon.sendMsg(conx, smsService, sendMsg, function (response) {
            if (response.retCode !== 200) {
              logger.error(response.retCode, response.description);
            }
          });
        }
      });

    }
  })
};
var isModbusDeviceSlaveRTU = function (deviceType) {
  var found = _.findIndex(MODBUS_DEVICE_SLAVE_RTU_TYPES, function (item) {
    return item === deviceType;
  });
  return -1 !== found;
};
var isModbusDeviceSlaveDLT = function (deviceType) {
  var found = _.findIndex(MODBUS_DEVICE_SLAVE_DLT_TYPES, function (item) {
    return item === deviceType;
  });
  return -1 !== found;
};
var getDevice = function (conx, condition, callback) {
  var cmd = {
    cmdName: "getDevice",
    cmdCode: "0001",
    parameters: condition
  };
  utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
    var device = null;
    if (response.retCode === 200 && util.isArray(response.data)) {
      device = response.data[0];
    } else if (response.retCode !== 203004) {
      logger.error(response.retCode, response.description);
    }
    callback(device);
  });
};
var getDeviceTypeByManufacturer = function (manufacturer) {
  if ("古瑞瓦特" === manufacturer) {
    return {
      id: "010001000004",
      name: "inverter",
      icon: ""
    }
  }
  else if ("锦浪" === manufacturer) {
    return {
      id: "01000C000004",
      name: "inverter",
      icon: ""
    }
  }
  else if ("易事特" === manufacturer) {
    return {
      id: "01000D000004",
      name: "inverter",
      icon: ""
    }
  }
  else if ("科陆电子" === manufacturer) {
    return {
      id: "04110E0E0001",
      name: "energy_meter",
      icon: ""
    }
  }
  else if ("易谷科技" === manufacturer) {
    return {
      id: "04110F0F0001",
      name: "weather_station",
      icon: ""
    }
  }
  return null;
};
var getDevices = function (conx, condition, callback) {
  var cmd = {
    cmdName: "getDevice",
    cmdCode: "0001",
    parameters: condition
  };
  utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
    var device = null;
    if (response.retCode === 200 && util.isArray(response.data)) {
      device = response.data;
    } else if (response.retCode !== 203004) {
      logger.error(response.retCode, response.description);
    }
    callback(device);
  });
};
var addDevice = function (conx, deviceInfo, callback) {
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

var getPropertyValue = function (properties, name) {
  var obj = _.find(properties, function (property) {
    return name === property["$"]["Name"];
  });
  if (obj) {
    return obj["$"]["Value"];
  }
  return null;
};
var getDlt645Table = function (Dlt645Table) {
  var table = [];
  _.forEach(Dlt645Table, function (item) {
    var cmd = {};
    _.forEach(item["ValueCheck"], function (item) {
      cmd[item["$"]["Num"]] = item["$"]["Value"];
    });
    table.push(cmd);
  });
  return table;
};
var getRtuCmd = function (RTUCmds) {
  var cmds = [];
  _.forEach(RTUCmds, function (item) {
    _.forEach(item["Propreties"], function (item) {
      var cmd = {};
      _.forEach(item["Property"], function (item) {
        cmd[item["$"]["Name"]] = item["$"]["Value"]
      });
      cmds.push(cmd);
    });
  });

  return cmds;
};

function devicesMe(conx) {
  this.conx = conx;
  this.postSynchronize = function (request, userId, token, callback) {
    var self = this;
    var res = JSON.parse(JSON.stringify(result));
    var configXml = Buffer.from(request.body.config, 'base64').toString();
    xmlParser.parseString(configXml, function (err, configJson) {
      if (err) {
        res.weiwiz.MHome.errorId = 200001;
        res.weiwiz.MHome.errorMsg = logger.getErrorInfo(200001);
        callback(res);
        return;
      }
      request.body.config = configJson;
      var deviceMacOrg = request.body.mac.toLowerCase();
      var deviceMacTag = deviceMacOrg.replace(/-/g, ':');
      logger.debug(deviceMacTag);
      conx.messageValidate(request.body, OPERATION_SCHEMAS.postSynchronize, function (error) {
        if (error) {
          res.weiwiz.MHome.errorId = error.retCode;
          res.weiwiz.MHome.errorMsg = error.description;
          callback(res);
          return;
        }
        async.waterfall([
          function (innerCallback) {
            //查询该采集器是否连接上云端
            getDevice(self.conx, {
              "extra.mac": deviceMacTag
            }, function (device) {
              util.isNullOrUndefined(device) ?
                innerCallback({
                  errorId: 203001,
                  errorMsg: "device dose not connected, please check the network of device."
                })
                : innerCallback(null, device)
            });
          },
          function (device, innerCallback) {
            var condition =
              {
                "location.locationName": configJson.Device.ModbusTcpServer[0]["$"]["Param"],//根据电站位置
                "type.id": SOLAR_PLANT_TYPE
              };
            console.log(condition);
            //查询采集器部署电站
            getDevice(conx, condition, function (plant) {
              //更新采集器属性
              var modbusTcpServer = configJson.Device.ModbusTcpServer;
              var updateCollector = {
                "uuid": device.uuid,
                "userId": userId, //设备属主为添加设备用户
                "name": "ZT-DME02" === request.body.model ? "ZT-DME02" : "ZT-DME04",
                "owner": util.isNullOrUndefined(plant) ? null : plant.uuid,
                "type.id": "ZT-DME02" === request.body.model ? MODBUS_GATEWAY1_TYPE_ID : MODBUS_GATEWAY2_TYPE_ID,
                "type.name": "ZT-DME02" === request.body.model ? "ZT-DME02" : "ZT-DME04",
                "location.locationId": util.isNullOrUndefined(plant) ? "" : plant.location.locationId,
                "location.locationName": util.isNullOrUndefined(plant) ? "" : plant.location.locationName,
                "location.locationType": util.isNullOrUndefined(plant) ? "" : plant.location.locationType,
                "extra.ipAddress": getPropertyValue(modbusTcpServer[0]["Propreties"][0]["Property"], "IP_ADDRESS"),
                "extra.subnetMask": getPropertyValue(modbusTcpServer[0]["Propreties"][0]["Property"], "SUBNET_MASK"),
                "extra.gateway": getPropertyValue(modbusTcpServer[0]["Propreties"][0]["Property"], "GETEWAY"),
                "extra.modbusTcpPort": getPropertyValue(modbusTcpServer[0]["Propreties"][0]["Property"], "ModbusTCP_Port"),
                "extra.configTcpPort": getPropertyValue(modbusTcpServer[0]["Propreties"][0]["Property"], "ConfigTCP_Port")
              };
              var updateCmd = {
                cmdName: "deviceUpdate",
                cmdCode: "0004",
                parameters: updateCollector
              };
              utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), updateCmd, function (response) {
                200 === response.retCode ? innerCallback(null, response.data) :
                  innerCallback({errorId: response.retCode, errorMsg: response.description});
              });
            });
          },
          function (deviceMaster, innerCallback) {
            var ownerId = deviceMaster.uuid;
            var modbusRtu = configJson.Device["Modbus-RTU"];
            getDevices(self.conx, {
              "userId": deviceMaster.userId,
              "owner": ownerId
            }, function (slaveDevices) {
              var oldDeviceIds = [];
              //获取老设备的UUID，用于新旧设备比对
              _.forEach(slaveDevices, function (slaveDevice) {
                if (isModbusDeviceSlaveRTU(slaveDevice.type.id)) {
                  oldDeviceIds.push(slaveDevice.uuid);
                }
              });
              //循环处理串口数据
              async.mapSeries(modbusRtu,
                function (modbusRtuItem, innerCallback1) {
                  var portNumber = modbusRtuItem["$"]["PortNumber"];
                  var modbusRtuSlave = modbusRtuItem["ModbusRTU-Slave"];
                  //循环处理串口下的从机数据
                  async.mapSeries(modbusRtuSlave,
                    function (modbusRtuSlaveItem, innerCallback2) {
                      var deviceParam = modbusRtuSlaveItem["$"]["Param"].split("|");
                      var slaveId = getPropertyValue(modbusRtuSlaveItem["Propreties"][0]["Property"], "Slave_ID");
                      var deviceSlave = {
                        name: modbusRtuSlaveItem["$"]["Text"],
                        userId: userId,   //设备属主为添加设备用户
                        owner: ownerId,   //设备父设备为采集器
                        type: getDeviceTypeByManufacturer(deviceParam[0]),
                        location: deviceMaster.location,
                        status: deviceMaster.status,//子设备初始状态取决于网关设备状态
                        extra: {
                          portNumber: util.isNullOrUndefined(portNumber) ? null : parseInt(portNumber),
                          slaveId: util.isNullOrUndefined(slaveId) ? null : parseInt(slaveId),
                          manufacturer: deviceParam[0],
                          model: deviceParam[1],
                          serialNumber: deviceParam[2],
                          modbusRtuCmd: getRtuCmd(modbusRtuSlaveItem["ModbusRTU-Cmd"])
                        }
                      };
                      var condition = {
                        "userId": deviceSlave.userId,
                        "owner": deviceSlave.owner,
                        "location.locationId": deviceSlave.location.locationId,//通电站的设备序列不能重复
                        "extra.manufacturer": deviceSlave.extra.manufacturer,
                        "extra.model": deviceSlave.extra.model,
                        "extra.portNumber": deviceSlave.extra.portNumber,
                        "extra.slaveId": deviceSlave.extra.slaveId
                        //"extra.serialNumber": deviceSlave.extra.serialNumber
                      };
                      //logger.debug(condition);
                      //查询该设备是否被添加过
                      getDevice(self.conx, condition, function (device) {
                        //添加过，则更新
                        if (device) {
                          var updateCmd = {
                            cmdName: "deviceUpdate",
                            cmdCode: "0004",
                            parameters: {
                              "uuid": device.uuid,
                              "location.locationId": deviceMaster.location.locationId,
                              "location.locationName": deviceMaster.location.locationName,
                              "location.locationType": deviceMaster.location.locationType,
                              "extra.slaveId": deviceSlave.extra.slaveId,
                              "extra.modbusRtuCmd": deviceSlave.extra.modbusRtuCmd
                            }
                          };
                          utilCommon.sendMsg(conx,
                            conx.configurator.getConfRandom("services.device_manager"),
                            updateCmd,
                            function (response) {
                              if (200 !== response.retCode) {
                                logger.error(response.retCode, response.description);
                              }
                            });
                          innerCallback2(null, device.uuid);//返回命中的老设备设备UUID
                        }
                        else {
                          //未添加，则添加新设备
                          addDevice(self.conx, deviceSlave, function (result) {
                            if (200 === result.weiwiz.MHome.errorId) {
                              logger.debug(result.weiwiz.MHome.response.uuid);
                              innerCallback2(null, result.weiwiz.MHome.response.uuid);//返回新设备UUID
                            }
                            else {
                              logger.error(result.weiwiz.MHome.errorId, result.weiwiz.MHome.errorMsg);
                              innerCallback2(null);//若出错则不返回
                            }
                          })
                        }
                      });
                    }, function (error, result) {
                      innerCallback1(null, result);
                    });
                }, function (error, result) {
                  var curDeviceIds = _.flattenDeep(result);//将二维数组将为一维数组
                  var deletedIds = _.difference(oldDeviceIds, curDeviceIds);
                  //删除在配置文件中被剔除的设备
                  _.forEach(deletedIds, function (deletedId) {
                    var cmd = {
                      cmdName: "deleteDevice",
                      cmdCode: "0002",
                      parameters: {
                        uuid: deletedId
                      }
                    };
                    utilCommon.sendMsgSync(conx,
                      conx.configurator.getConfRandom("services.device_manager"),
                      cmd,
                      function (result) {
                        if (200 !== result.weiwiz.MHome.errorId) {
                          logger.error(result.weiwiz.MHome.errorId, result.weiwiz.MHome.errorMsg);
                        }
                      });
                  });
                  innerCallback(null, deviceMaster, curDeviceIds);
                });
            });
          },
          function (deviceMaster, invertersIds, innerCallback) {
            var ownerId = deviceMaster.uuid;
            var DLT645 = configJson.Device["DLT645"];
            getDevices(self.conx, {
              "userId": deviceMaster.userId,
              "owner": ownerId
            }, function (slaveDevices) {
              var oldDeviceIds = [];
              //获取老设备的UUID，用于新旧设备比对
              _.forEach(slaveDevices, function (slaveDevice) {
                if (isModbusDeviceSlaveDLT(slaveDevice.type.id)) {
                  oldDeviceIds.push(slaveDevice.uuid);
                }
              });
              //循环处理串口数据
              async.mapSeries(DLT645,
                function (modbusDLTItem, innerCallback1) {
                  var portNumber = modbusDLTItem["$"]["PortNumber"];
                  var modbusDLTSlave = modbusDLTItem["DLT645-Slave"];
                  //循环处理串口下的从机数据
                  async.mapSeries(modbusDLTSlave,
                    function (modbusRtuSlaveItem, innerCallback2) {
                      var deviceParam = modbusRtuSlaveItem["$"]["Param"].split("|");
                      var slaveId = getPropertyValue(modbusRtuSlaveItem["Propreties"][0]["Property"], "Slave_ID");
                      var deviceSlave = {
                        name: modbusRtuSlaveItem["$"]["Text"],
                        userId: userId,   //设备属主为添加设备用户
                        owner: ownerId,   //设备父设备为采集器
                        type: getDeviceTypeByManufacturer(deviceParam[0]),
                        location: deviceMaster.location,
                        extra: {
                          portNumber: util.isNullOrUndefined(portNumber) ? null : parseInt(portNumber),
                          slaveId: util.isNullOrUndefined(slaveId) ? null : parseInt(slaveId),
                          manufacturer: deviceParam[0],
                          model: deviceParam[1],
                          serialNumber: deviceParam[2],
                          Dlt645Table: getDlt645Table(modbusRtuSlaveItem["Dlt645Table"])
                        }
                      };
                      var condition = {
                        "userId": deviceSlave.userId,
                        "owner": deviceSlave.owner,
                        "extra.manufacturer": deviceSlave.extra.manufacturer,
                        "extra.model": deviceSlave.extra.model,
                        "extra.serialNumber": deviceSlave.extra.serialNumber
                      };
                      //查询该设备是否被添加过
                      getDevice(self.conx, condition, function (device) {
                        //添加过，则更新
                        if (device) {
                          var updateCmd = {
                            cmdName: "deviceUpdate",
                            cmdCode: "0004",
                            parameters: {
                              "uuid": device.uuid,
                              "location.locationId": deviceMaster.location.locationId,
                              "location.locationName": deviceMaster.location.locationName,
                              "location.locationType": deviceMaster.location.locationType,
                              "extra.slaveId": deviceSlave.extra.slaveId,
                              "extra.Dlt645Table": deviceSlave.extra.Dlt645Table
                            }
                          };
                          utilCommon.sendMsg(conx,
                            conx.configurator.getConfRandom("services.device_manager"),
                            updateCmd,
                            function (response) {
                              if (200 !== response.retCode) {
                                logger.error(response.retCode, response.description);
                              }
                            });
                          innerCallback2(null, device.uuid);//返回命中的老设备设备UUID
                        }
                        else {
                          //未添加，则添加新设备
                          addDevice(self.conx, deviceSlave, function (result) {
                            if (200 === result.weiwiz.MHome.errorId) {
                              logger.debug(result.weiwiz.MHome.response.uuid);
                              innerCallback2(null, result.weiwiz.MHome.response.uuid);//返回新设备UUID
                            }
                            else {
                              logger.error(result.weiwiz.MHome.errorId, result.weiwiz.MHome.errorMsg);
                              innerCallback2(null);//若出错则不返回
                            }
                          })
                        }
                      });
                    }, function (error, result) {
                      innerCallback1(null, result);
                    });
                }, function (error, result) {
                  var curDeviceIds = _.flattenDeep(result);//将二维数组将为一维数组
                  var deletedIds = _.difference(oldDeviceIds, curDeviceIds);
                  //删除在配置文件中被剔除的设备
                  _.forEach(deletedIds, function (deletedId) {
                    var cmd = {
                      cmdName: "deleteDevice",
                      cmdCode: "0002",
                      parameters: {
                        uuid: deletedId
                      }
                    };
                    utilCommon.sendMsgSync(conx,
                      conx.configurator.getConfRandom("services.device_manager"),
                      cmd,
                      function (result) {
                        if (200 !== result.weiwiz.MHome.errorId) {
                          logger.error(result.weiwiz.MHome.errorId, result.weiwiz.MHome.errorMsg);
                        }
                      });
                  });
                  innerCallback(null, _.concat(curDeviceIds, invertersIds));
                });
            });
          }
        ], function (error, result) {
          if (error) {
            res.weiwiz.MHome.errorId = error.errorId;
            res.weiwiz.MHome.errorMsg = error.errorMsg;
          }
          else {
            res.weiwiz.MHome.errorId = 200;
            res.weiwiz.MHome.errorMsg = "SUCCESS.";
            res.weiwiz.MHome.response = {uuids: result};
          }
          callback(res);
        });
      });
    });
  };
  this.post = function (request, userId, token, callback) {
    logger.debug(request.body);
    conx.messageValidate(request.body, OPERATION_SCHEMAS.post, function (error) {
      var res = JSON.parse(JSON.stringify(result));
      if (error) {
        res.weiwiz.MHome.errorId = error.retCode;
        res.weiwiz.MHome.errorMsg = error.description;
        callback(res);
      }
      else {
        if (util.isNullOrUndefined(request.body.owner)) {
          request.body.owner = userId;
        }
        request.body.userId = userId;
        request.body.ipAddress = utilCommon.getClientIP(request);
        //request.body.deviceIpAddress = request.body.ipAddress;
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
        if (SOLAR_PLANT_TYPE === request.body.type.id
          && request.body.location) {
          var condition = {
            "name": request.body.location.locationName,
            "type.id": request.body.location.locationType
          };
          getDevice(conx, condition, function (location) {
            if (!util.isNullOrUndefined(location)) {
              request.body["location"] = {
                locationId: location.uuid,
                locationName: location.name,
                locationType: location.type.id
              };
              addDevice(conx, request.body, callback);
            }
            else {
              var res = JSON.parse(JSON.stringify(result));
              res.weiwiz.MHome.errorId = 204010;
              res.weiwiz.MHome.errorMsg = "no such location for device:" + body.name;
              res.weiwiz.MHome.response = {
                uuid: device.uuid,
                token: device.myToken
              };
              callback(res);
            }
          });
        }
        else if (KMJ_LED_TYPE === request.body.type.id) {
          getDevice(
            conx,
            {
              "userId": userId,
              "type.id": KMJ_LED_TYPE,
              "extra.serial_number": request.body.extra.serial_number
            },
            function (device) {
              if (util.isNullOrUndefined(device)) {
                addDevice(conx, request.body, callback);
              }
              else {
                var res = JSON.parse(JSON.stringify(result));
                res.weiwiz.MHome.errorId = 200;
                res.weiwiz.MHome.errorMsg = "Success.";
                res.weiwiz.MHome.response = {
                  uuid: device.uuid,
                  token: device.myToken
                };
                callback(res);
              }
            });
        }
        else {
          addDevice(conx, request.body, callback);
        }
      }
    });
  };
  this.get = function (request, userId, token, deviceId, callback) {
    var res = _.cloneDeep(result);
    logger.debug(request.query);
    if (!util.isNullOrUndefined(request.query["deviceFilter"])) {
      var deviceFilterStr = Buffer.from(request.query["deviceFilter"], 'base64').toString();
      logger.debug(deviceFilterStr);
      delete request.query["deviceFilter"];
      try {
        var deviceFilterObj = JSON.parse(deviceFilterStr);
        if (deviceFilterObj && _.isObject(deviceFilterObj)) {
          logger.debug(deviceFilterObj);
          _.forIn(deviceFilterObj, function (value, key) {
            request.query[key] = value;
          });
          logger.debug(request.query);
        }
      }
      catch (e) {
        logger.debug(e);
        res.weiwiz.MHome.errorId = 204001;
        res.weiwiz.MHome.errorMsg = "Invalid request data:[deviceFilter]";
        return res;
      }
    }
    //兼容老的查询参数
    if (!util.isNullOrUndefined(request.query["type"])) {
      request.query["type.id"] = request.query["type"];
      delete request.query["type"];
    }
    if (!util.isNullOrUndefined(request.query["rfid"])) {
      request.query["extra.rfid"] = request.query["rfid"];
      delete request.query["rfid"];
    }
    var cmd = {
      cmdName: "getDevice",
      cmdCode: "0003",
      parameters: _.cloneDeep(request.query)
    };
    if (!util.isNullOrUndefined(deviceId)) {
      cmd.parameters.uuid = deviceId;
    }
    if (!util.isNullOrUndefined(userId)) {
      cmd.parameters.userId = userId;
    }
    delete cmd.parameters["detail"];
    delete cmd.parameters["page"];
    delete cmd.parameters["pageSize"];
    var typeIds = util.isNullOrUndefined(request.query["type.id"]) ? [] : request.query["type.id"].split(",");
    if (typeIds.length === 1) {
      cmd.parameters["type.id"] = _.first(typeIds);
    }
    else {
      delete cmd.parameters["type.id"];
    }
    logger.debug(cmd);
    utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
      res.weiwiz.MHome.errorId = response.retCode;
      res.weiwiz.MHome.errorMsg = response.description;
      if (response.retCode === 200) {
        if (util.isArray(typeIds) && typeIds.length > 1) {
          response.data = _.filter(response.data, function (device) {
            return -1 !== _.findIndex(typeIds, function (typeId) {
              return typeId === device.type.id;
            });
          });
        }
        var totalSize = response.data.length;
        var page = parseInt(request.query["page"]);
        var pageSize = request.query["pageSize"] ? parseInt(request.query["pageSize"]) : 10;
        if (!util.isNullOrUndefined(page) && util.isNumber(page) && page >= 1) {
          var pageData = [];
          for (var offset = (page - 1) * pageSize; offset < response.data.length && pageSize > 0; ++offset, --pageSize) {
            pageData.push(response.data[offset]);
          }
          response.data = pageData;
        }
        response.data.forEach(function (device) {
          if (!util.isNullOrUndefined(request.query["detail"])
            && false === request.query["detail"]) {
            delete device.extra;
          }
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
          if (!util.isNullOrUndefined(page) && util.isNumber(page) && page >= 1) {
            res.weiwiz.MHome.response = {
              totalSize: totalSize,
              page: page,
              pageSize: request.query["pageSize"] ? parseInt(request.query["pageSize"]) : 10,
              data: response.data
            };
          }
          else
            res.weiwiz.MHome.response = response.data;
        }
      }
      callback(res);
    });
  };
  this.put = function (request, userId, token, deviceId, callback) {
    conx.messageValidate(request.body, OPERATION_SCHEMAS.put, function (error) {
      var res = JSON.parse(JSON.stringify(result));
      if ("abc43e47-9de9-435c-8004-bf54550235dd" === userId) {
        res.weiwiz.MHome.errorId = 204004;
        res.weiwiz.MHome.errorMsg = "Sorry, exhibition device does not allowed to update.";
        callback(res);
        return;
      }
      if (error) {
        res.weiwiz.MHome.errorId = error.retCode;
        res.weiwiz.MHome.errorMsg = error.description;
        callback(res);
      }
      else {
        logger.debug("device update: " + JSON.stringify(request.body));
        var device = {};
        if (!util.isArray(request.body) && util.isObject(request.body)) {
          mjson.transformJS(request.body, null, device);
        }
        device.uuid = deviceId;
        device.userId = userId;
        var cmd = {
          cmdName: "deviceUpdate",
          cmdCode: "0004",
          parameters: device
        };
        logger.debug(cmd);
        //西昌米易康养拦截处理
        if ("9901a149-bebc-418d-9656-fcaf08985549" === userId
          && !util.isNullOrUndefined(request.body.extra)
          && !util.isNullOrUndefined(request.body.extra.items)
          && !util.isNullOrUndefined(request.body.extra.items.sos)
          && true === request.body.extra.items.sos) {
          sendSOSMessage(deviceId, userId, conx);
        }
        utilCommon.sendMsgSync(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, callback);
      }
    });
  };
  this.delete = function (request, userId, token, deviceId, callback) {
    logger.warn("delete device :" + deviceId);
    //展会数据禁止删除
    if ("abc43e47-9de9-435c-8004-bf54550235dd" === userId) {
      var res = JSON.parse(JSON.stringify(result));
      res.weiwiz.MHome.errorId = 204004;
      res.weiwiz.MHome.errorMsg = "Sorry, exhibition device does not allowed to delete.";
      callback(res);
      return;
    }
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