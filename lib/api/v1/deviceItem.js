/**
 * Created by song on 2015/7/2.
 */
var _ = require('util');
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var utilCommon = require('./util/common.js');

function deviceItem(conx) {
    this.get = function (request, userId, token, deviceId, callbackRes) {
        var res = JSON.parse(JSON.stringify(result));
        logger.warn("deviceItem get : " + deviceId);
        utilCommon.getDevice(conx, userId, deviceId, function (device) {
            if (!_.isNullOrUndefined(device)) {
                res.weiwiz.MHome.errorId = 200;
                if (!_.isNullOrUndefined(device.extra) && !_.isNullOrUndefined(device.extra.items)) {
                    logger.debug(device.extra.items);
                    res.weiwiz.MHome.response = device.extra.items;
                }
                //取网络状态
                res.weiwiz.MHome.response.switchStatus = device.status.switch;
                res.weiwiz.MHome.response.networkStatus = device.status.network;
            }
            else{
                res.weiwiz.MHome.errorId = 203004;
            }
            callbackRes(res);
        });
    }
}

module.exports = deviceItem;