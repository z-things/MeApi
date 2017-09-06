/**
 * Created by jacky on 2017/8/21.
 */
var _ = require('lodash');
var util = require('util');
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var utilCommon = require('./util/common.js');
function serviceLighting(conx) {
    this.get = function (request, userId, token, callback) {
        logger.warn("M-API sendMsg: serviceLighting request");
        var res = _.clone(result, true);
        res.weiwiz.MHome.response = [];
        res.weiwiz.MHome.errorId = 200;
        utilCommon.getDevices(conx, userId, function (devices) {
            if (!util.isNullOrUndefined(devices) && util.isArray(devices)) {
                var groupLocation = {};
                devices.forEach(function (device, index) {
                    if ("040B09050101" === device.type.id
                        || "040B09050203" === device.type.id) {
                        var locationName = "default";
                        var locationIcon = "ic_location_default.png";
                        if (!util.isNullOrUndefined(device.location.locationName)) {
                            locationName = device.location.locationName;
                        }
                        if (util.isNullOrUndefined(groupLocation[locationName])) {
                            if ("default" !== locationName) {
                                var room = locationName.split(",")[1];
                                if (!util.isNullOrUndefined(room)) {
                                    room = room.toLowerCase();
                                    room = room.replace(/ /g, "_");
                                    locationIcon = "ic_" + room + ".png";
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