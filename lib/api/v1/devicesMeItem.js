/**
 * Created by song on 2015/7/2.
 */
var util = require('util');
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var utilCommon = require('./util/common.js');

function devicesMeItem(conx) {
    this.get = function (request, userId, token, deviceId, itemName, callbackRes) {
        logger.warn("M-API sendMsg: devicesMeItem request: " + itemName);
        var res = JSON.parse(JSON.stringify(result));
        utilCommon.getDevice(conx, userId, deviceId, function (device) {
            if (!util.isNullOrUndefined(device)) {
                logger.debug(device);
                res.weiwiz.MHome.errorId = 200;
                if (!util.isNullOrUndefined(device.extra) && !util.isNullOrUndefined(device.extra.items)) {
                    logger.debug(device.extra.items);
                    res.weiwiz.MHome.response[itemName] = device.extra.items[itemName];
                }
            }
            else{
                res.weiwiz.MHome.errorId = 203004;
            }
            callbackRes(res);
        });
    }
}

module.exports = devicesMeItem;