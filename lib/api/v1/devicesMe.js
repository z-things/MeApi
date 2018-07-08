/**
 * Created by song on 2015/7/2.
 */
'use strict';
var _ = require('lodash');
var util = require('util');
var async = require('async');
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
          "root": {
            "type": "object",
            "properties": {
              "Modbus": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "$": {
                      "type": "object",
                      "properties": {
                        "NickName": {"type": "string"},
                        "Param": {"type": "string"}
                      }
                    },
                    "MAC_ADDRESS": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "IP_ADDRESS": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "SUBNET_MASK": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "GETEWAY": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "ModbusTCP_Port": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "ConfigTCP_Port": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "Modbus_RTU": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "$": {
                      "type": "object",
                      "properties": {
                        "NickName": {"type": "string"}
                      }
                    },
                    "Serial1_Mode": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "Serial_Baud_Rate": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "data_length": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "Parity_Mode": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "stop_num": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "Send_Pitch": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "Slave_ID": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "Respond_Delay": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "Value": {"type": "string"}
                            }
                          }
                        }
                      }
                    },
                    "Modbus_RTU_Slave": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "$": {
                            "type": "object",
                            "properties": {
                              "NickName": {"type": "string"},
                              "Param": {"type": "string"}
                            }
                          },
                          "Slave_ID": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "$": {
                                  "type": "object",
                                  "properties": {
                                    "Value": {"type": "string"}
                                  }
                                }
                              }
                            }
                          },
                          "Modbus_RTU_CMD": {
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
              "DT_T645": {
                "Modbus_RTU": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "$": {
                        "type": "object",
                        "properties": {
                          "NickName": {"type": "string"}
                        }
                      },
                      "Serial_Baud_Rate": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "$": {
                              "type": "object",
                              "properties": {
                                "Value": {"type": "string"}
                              }
                            }
                          }
                        }
                      },
                      "Usart2_Send_Pitch": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "$": {
                              "type": "object",
                              "properties": {
                                "Value": {"type": "string"}
                              }
                            }
                          }
                        }
                      },
                      "data_type": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "$": {
                              "type": "object",
                              "properties": {
                                "Value": {"type": "string"}
                              }
                            }
                          }
                        }
                      },
                      "data_format": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "$": {
                              "type": "object",
                              "properties": {
                                "Value": {"type": "string"}
                              }
                            }
                          }
                        }
                      },
                      "DT_T645_Slave": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "$": {
                              "type": "object",
                              "properties": {
                                "NickName": {"type": "string"},
                                "Param": {"type": "string"}
                              }
                            },
                            "Slave_ID": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "$": {
                                    "type": "object",
                                    "properties": {
                                      "Value": {"type": "string"}
                                    }
                                  }
                                }
                              }
                            },
                            "Version": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "$": {
                                    "type": "object",
                                    "properties": {
                                      "Value": {"type": "string"}
                                    }
                                  }
                                }
                              }
                            },
                            "Respond_OutTime": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "$": {
                                    "type": "object",
                                    "properties": {
                                      "Value": {"type": "string"}
                                    }
                                  }
                                }
                              }
                            },
                            "DT_T645_Table": {
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
              }
            }
          }
        }
      }
    }
  }
};
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
  if ("锦浪" === manufacturer) {
    return {
      id: "01000C000004",
      name: "inverter",
      icon: ""
    }
  }
  if ("易事特" === manufacturer) {
    return {
      id: "01000D000004",
      name: "inverter",
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

function devicesMe(conx) {
  this.conx = conx;
  this.postSynchronize = function (request, userId, token, callback) {
    var self = this;
    logger.debug(request.body);
    conx.messageValidate(request.body, OPERATION_SCHEMAS.postSynchronize, function (error) {
      var res = JSON.parse(JSON.stringify(result));
      if (error) {
        res.weiwiz.MHome.errorId = error.retCode;
        res.weiwiz.MHome.errorMsg = error.description;
        callback(res);
        return;
      }
      var config = request.body.config;
      async.waterfall([
        function (innerCallback) {
          //查询该采集器是否连接上云端
          getDevice(self.conx, {
            "extra.mac": config.root.Modbus[0]["MAC_ADDRESS"][0]["$"]["value"]
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
          //查询采集器部署电站
          getDevice(conx, {
            "location.locationName": config.root.Modbus[0]["$"]["Param"],//根据电站位置
            "type.id": SOLAR_PLANT_TYPE
          }, function (plant) {
            //更新采集器属性
            var modbus = config.root.Modbus;
            var updateCollector = {
              "uuid": device.uuid,
              "userId": userId, //设备属主为添加设备用户
              "name": modbus[0]["$"]["NickName"],
              "owner": util.isNullOrUndefined(plant) ? null : plant.uuid,
              "type.id": "ZT-DME02" === request.body.model ? MODBUS_GATEWAY1_TYPE_ID : MODBUS_GATEWAY2_TYPE_ID,
              "type.name": "ZT-DME02" === request.body.model ? "ZT-DME02" : "ZT-DME04",
              "location.locationId": util.isNullOrUndefined(plant) ? "" : plant.location.locationId,
              "location.locationName": util.isNullOrUndefined(plant) ? "" : plant.location.locationName,
              "location.locationType": util.isNullOrUndefined(plant) ? "" : plant.location.locationType,
              "extra.ipAddress": modbus[0]["IP_ADDRESS"][0]["$"]["Value"],
              "extra.subnetMask": modbus[0]["SUBNET_MASK"][0]["$"]["Value"],
              "extra.gateway": modbus[0]["GETEWAY"][0]["$"]["Value"],
              "extra.modbusTcpPort": modbus[0]["ModbusTCP_Port"][0]["$"]["Value"],
              "extra.configTcpPort": modbus[0]["ConfigTCP_Port"][0]["$"]["Value"]
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
          var modbusRtu = config.root.Modbus_RTU;
          getDevices(self.conx, {
            "userId": deviceMaster.userId,
            "owner": ownerId
          }, function (slaveDevices) {
            var oldDeviceIds = [];
            //获取老设备的UUID，用于新旧设备比对
            _.forEach(slaveDevices, function (slaveDevice) {
              oldDeviceIds.push(slaveDevice.uuid);
            });
            //循环处理串口数据
            async.mapSeries(modbusRtu,
              function (modbusRtuItem, innerCallback1) {
                var modbusRtuSlave = modbusRtuItem.Modbus_RTU_Slave;
                //循环处理串口下的从机数据
                async.mapSeries(modbusRtuSlave,
                  function (modbusRtuSlaveItem, innerCallback2) {
                    var deviceParam = modbusRtuSlaveItem["$"]["Param"].split("|");
                    var deviceSlave = {
                      name: modbusRtuSlaveItem["$"]["NickName"],
                      userId: userId,   //设备属主为添加设备用户
                      owner: ownerId,   //设备父设备为采集器
                      type: getDeviceTypeByManufacturer(deviceParam[0]),
                      location: deviceMaster.location,
                      extra: {
                        slaveId: modbusRtuSlaveItem["Slave_ID"][0]["$"]["Value"],
                        manufacturer: deviceParam[0],
                        model: deviceParam[1],
                        serialNumber: deviceParam[2],
                        modbusRtuCmd: modbusRtuSlaveItem["Modbus_RTU_CMD"]
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
                innerCallback(null, curDeviceIds);
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
          res.weiwiz.MHome.response = result;
        }
        callback(res);
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
        if (KMJ_LED_TYPE === request.body.type.id) {
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
  this.get = function (request, userId, token, deviceId, deviceType, callback) {
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
    if ("35426839-f65b-42b6-8b85-0b46a8100fb4" === userId) {
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