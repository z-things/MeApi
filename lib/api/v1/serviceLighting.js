/**
 * Created by jacky on 2017/8/21.
 */
'use strict';
var _ = require('lodash');
var util = require('util');
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var utilCommon = require('./util/common.js');
var ICON_MAP = {
  //房间
  "客厅": "icon_def_living_room.png", "Living Room": "icon_def_living_room.png",
  "厨房": "icon_def_cook_room.png", "Cook Room": "icon_def_cook_room.png",
  "餐厅": "icon_def_dining_room.png", "Dining Room": "icon_def_dining_room.png",
  "主卧": "icon_def_master_bed_room.png", "Master Bed Room": "icon_def_master_bed_room.png",
  "次卧": "icon_def_bedroom.png", "Bed Room": "icon_def_bedroom.png",
  "过道": "icon_def_corridor.png", "Corridor": "icon_def_corridor.png",
  "卫生间": "icon_def_bathroom.png", "Bathroom": "icon_def_bathroom.png",
  "车库": "icon_def_garage.png", "Garage": "icon_def_garage.png",
  "书房": "icon_def_study.png", "Study Room": "icon_def_study.png",
  "衣帽间": "icon_def_cloakroom.png", "Cloakroom": "icon_def_cloakroom.png",
  "工具间": "icon_def_tool_room.png", "Tool Room": "icon_def_tool_room.png",
  "储物间": "icon_def_tool_room.png", "Storage Room": "icon_def_storage_room.png",
  "儿童房": "icon_def_children_room.png", "Children Room": "icon_def_children_room.png",
  "健生房": "icon_def_gym.png", "Gym": "icon_def_gym.png",
  //区域
  "一楼": "icon_def_location_default.png", "Ground Floor": "icon_def_ground_floor.png",
  "二楼": "icon_def_location_default.png", "Second Floor": "icon_def_second_floor.png",
  "三楼": "icon_def_location_default.png", "Third Floor": "icon_def_third_floor.png",
  "天台": "icon_def_location_default.png", "Rooftop": "icon_def_Rooftop.png",
  "地下室": "icon_def_location_default.png", "Basement": "icon_def_Basement.png",
  "花园": "icon_def_garden.png", "Garden": "icon_def_garden.png"
};

function serviceLighting(conx) {
  this.get = function (request, userId, token, callback) {
    logger.warn("M-API sendMsg: serviceLighting request");
    var res = JSON.parse(JSON.stringify(result));
    res.weiwiz.MHome.response = [];
    res.weiwiz.MHome.errorId = 200;
    utilCommon.getDevices(conx, userId, function (devices) {
      if (!util.isNullOrUndefined(devices) && util.isArray(devices)) {
        var groupLocation = {};
        devices.forEach(function (device, index) {
          if ("040B09050101" === device.type.id
            || "040B09050203" === device.type.id) {
            var locationName = "default";
            var locationIcon = "icon_def_location_default.png";
            if (!util.isNullOrUndefined(device.location.locationName)) {
              locationName = device.location.locationName;
            }
            if (util.isNullOrUndefined(groupLocation[locationName])) {
              if ("default" !== locationName) {
                var region = locationName.split(",")[0];
                var room = locationName.split(",")[1];
                if (!util.isNullOrUndefined(ICON_MAP[room])) {
                  locationIcon = ICON_MAP[room];
                }
                else if (!util.isNullOrUndefined(ICON_MAP[region])) {
                  locationIcon = ICON_MAP[region];
                }
              }
              groupLocation[locationName] = {
                "locationName": locationName,
                "locationIcon": locationIcon,
                "on": 0,
                "off": 0,
                "devices": []
              };
            }
            groupLocation[locationName].devices.push(device.uuid);
            device.status.switch === "ON" ? groupLocation[locationName].on++ : groupLocation[locationName].off++
          }
        });
        _.forIn(groupLocation, function (value, key) {
          res.weiwiz.MHome.response.push(value);
        });
      }
      callback(res);
    })
  }
}

module.exports = serviceLighting;