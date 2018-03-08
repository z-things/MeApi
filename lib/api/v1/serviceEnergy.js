/**
 * Created by jacky on 2017/8/21.
 */
'use strict';
var util = require('util');
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var utilCommon = require('./util/common.js');
var typeNameMap = {
  "040B08040004": "MeBoost",
  "040B01000001": "MeRFCT",
  "040B01000005": "MeStorage",
  "040B01000004": "MeInverter"
};
var energyMap = {
  "icons": {
    "Grip": 0, 		// 0:空闲,1:取电，2：发电
    "MeRFCT": 0,		// 0:无设备,1:设备正常，2：设备异常
    "PV": 0,			// 0:无设备,1:设备正常
    "MeInverter": 0,   // 0:无设备,1:设备正常, 2:设备异常
    "MeStorage": 0,	// 0:无设备,1:设备正常, 2:设备异常
    "MeStorageBattery": 0,	//设备充电百分比
    "MeBoost": 0,	    // 0:无设备,1:设备正常, 2:设备异常
    "Load": 0	    // 0:无负载,1:仅热水器负载, 2:仅其他家庭负载，3：全负载
  },
  "lines": {
    "G2R": 0,		// 0:空闲,1:电网取电，2：太阳能发电
    "R2L": 0,		// 0:空闲,1:电网取电，2：太阳能取电
    "PV2I": 0,	    // 0:空闲,		      2：太阳能发电
    "PV2S": 0,	    // 0:空闲,1:太阳能充电，2：放电
    "S2B": 0,		// 0:空闲,1:太阳充电，2：放电
    "I2B": 0,		// 0:空闲,1:太阳能取电，
    "R2B": 0,		// 0:空闲,1:电网取电，
    "B2L": 0,		// 0:空闲,1:电网取电，2：太阳能取电
    "I2R": 0		// 0:空闲,1：太阳能发电
  }
};

function serviceEnergy(conx) {
  this.get = function (request, userId, token, callback) {
    logger.warn("M-API sendMsg: serviceEnergy request");
    var res = JSON.parse(JSON.stringify(result));
    res.weiwiz.MHome.response = JSON.parse(JSON.stringify(energyMap));
    res.weiwiz.MHome.errorId = 200;
    utilCommon.getDevices(conx, userId, function (devices) {
      if (!util.isNullOrUndefined(devices)) {
        var MeBoost = null;
        var MeRFCT = null;
        var MeStorage = null;
        var MeInverter = null;
        var energyMapCopy = res.weiwiz.MHome.response;
        for (var i = 0, len = devices.length; i < len; ++i) {
          var device = devices[i];
          logger.debug(device);
          if (device.type.id === "040B08040004") {
            MeBoost = device;
            if (device.status.switch !== "ERR" && device.status.network !== "DISCONNECTED") {
              energyMapCopy.icons.MeBoost = 1;
            }
            else {
              energyMapCopy.icons.MeBoost = 2;
            }
          }
          else if (device.type.id === "040B01000001") {
            MeRFCT = device;
            if (device.status.switch !== "ERR" && device.status.network !== "DISCONNECTED") {
              energyMapCopy.icons.MeRFCT = 1;
            }
            else {
              energyMapCopy.icons.MeRFCT = 2;
            }
          }
          else if (device.type.id === "040B01000005") {
            MeStorage = device;
            if (device.status.switch !== "ERR" && device.status.network !== "DISCONNECTED") {
              energyMapCopy.icons.MeStorage = 1;
              energyMapCopy.icons.MeStorageBattery = device.extra.items.capacity;
            }
            else {
              energyMapCopy.icons.MeStorage = 2;
              energyMapCopy.icons.MeStorageBattery = 0;
            }
          }
          else if (device.type.id === "040B01000004") {
            MeInverter = device;
            energyMapCopy.icons.PV = 1;
            if (device.status.switch !== "ERR" && device.status.network !== "DISCONNECTED") {
              energyMapCopy.icons.MeInverter = 1;
            }
            else {
              energyMapCopy.icons.MeInverter = 2;
            }
          }
        }
        if (!util.isNullOrUndefined(MeBoost)) {
          if (MeBoost.status.switch === "ON" && MeBoost.extra.items.power > 0) {
            energyMapCopy.icons.Load = 1;
            if (MeBoost.extra.items.mode === 1 || MeBoost.extra.items.mode === 5) {
              energyMapCopy.lines.PV2I = 2;
              energyMapCopy.lines.I2B = 1;
              energyMapCopy.lines.B2L = 2;
            }
            else if (MeBoost.extra.items.mode === 2) {
              energyMapCopy.lines.G2R = 1;
              energyMapCopy.lines.R2B = 1;
              energyMapCopy.lines.B2L = 1;
            }
          }
        }
        if (!util.isNullOrUndefined(MeRFCT)) {
          if (!util.isNullOrUndefined(MeRFCT.extra.items.effectiveVolt)
            && !util.isNullOrUndefined(MeRFCT.extra.items.effectiveCurrent)) {
            var effectPower = MeRFCT.extra.items.effectiveVolt * MeRFCT.extra.items.effectiveCurrent / 100;
            if (MeRFCT.extra.items.direct === 16) {
              if (effectPower > 0) {
                //如果存在顺流，表示在向电网取电
                energyMapCopy.icons.Grip = 1;
                energyMapCopy.lines.G2R = 1;
              }
              if (!util.isNullOrUndefined(MeBoost)) {
                //如果顺流功率大于MeBoost的工作功率，说明家庭其他负载正在向电网取电
                if (effectPower > (MeBoost.extra.items.power / 100)) {
                  energyMapCopy.lines.R2L = 1;
                  if (energyMapCopy.icons.Load === 0) {
                    energyMapCopy.icons.Load = 2;
                  }
                  else if (energyMapCopy.icons.Load === 1) {
                    energyMapCopy.icons.Load = 3;
                  }
                }
              }
            }
            else {
              if (effectPower > 0) {
                //如果是逆流，说明在向电网输电
                energyMapCopy.icons.Grip = 2;
                energyMapCopy.lines.G2R = 2;
                energyMapCopy.lines.I2R = 1;
              }
              if (!util.isNullOrUndefined(MeInverter)) {
                if (!util.isNullOrUndefined(MeBoost)) {
                  //如果存在逆流，且除去MeBoost消耗的电能还大于逆流值，标明其他负载正在用太阳能
                  if (MeInverter.extra.items.currentPower - MeBoost.extra.items.power / 100 > effectPower) {
                    energyMapCopy.lines.R2L = 2;
                    if (energyMapCopy.icons.Load === 0) {
                      energyMapCopy.icons.Load = 2;
                    }
                    else if (energyMapCopy.icons.Load === 1) {
                      energyMapCopy.icons.Load = 3;
                    }
                  }
                }
                else {
                  //如果存在逆流，且小于逆变器的输出，表明其他负载正在用太阳能
                  if (MeInverter.extra.items.currentPower > effectPower) {
                    energyMapCopy.lines.R2L = 2;
                    energyMapCopy.icons.Load = 2;
                  }
                }
              }
            }
          }
        }
      }
      callback(res);
    })
  }
}

module.exports = serviceEnergy;