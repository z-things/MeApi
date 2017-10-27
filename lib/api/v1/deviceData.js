/**
 * Created by song on 2015/7/2.
 */
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var utilCommon = require('./util/common.js');

function deviceData(conx) {
    this.get = function (request, userId, token, deviceId, callback) {
        var res = JSON.parse(JSON.stringify(result));
        var parameter = {};
        logger.debug(request.query);
        if (request.query["query"]) {
            parameter = JSON.parse(request.query["query"]);
        }
        else {
            parameter = {
                "dataType": request.query["dataType"],
                "timestamp": {
                    "$gte": request.query["timestampStart"],
                    "$lt": request.query["timestampStop"]
                }
            }
        }
        parameter.uuid = deviceId;
        var cmd = {
            cmdName: "getData",
            cmdCode: "0001",
            parameters: parameter
        };
        utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.data_manager"), cmd, function (response) {
            res.weiwiz.MHome.errorId = response.retCode;
            res.weiwiz.MHome.errorMsg = response.description;
            if (response.retCode === 200) {
                res.weiwiz.MHome.response.reports = response.data;
                /*var inverterIsExist = utilCommon.deviceIsExist(conx, userId, "010101000004");
                for (var i = 0, len = res.weiwiz.MHome.response.reports.length; i < len; ++i) {
                    res.weiwiz.MHome.response.reports[i].time = new Date(res.weiwiz.MHome.response.reports[i].timestamp).getTime();
                    if (res.weiwiz.MHome.response.reports[i].type === "060A08000000" && !inverterIsExist && res.weiwiz.MHome.response.reports[i].deviceEnergyUsed !== null) {
                        res.weiwiz.MHome.response.reports[i].energyUsed = res.weiwiz.MHome.response.reports[i].deviceEnergyUsed;
                    }
                }*/
            }
            //logger.warn("M-API sendMsg getData: parameter=" + JSON.stringify(parameter) + ", response=" + JSON.stringify(res));
            callback(res);
        });
    };

    this.post = function (request, userId, token, deviceId, callback) {
        var res = JSON.parse(JSON.stringify(result));
        var parameter = request.body;
        var cmd = {
            cmdName: "putData",
            cmdCode: "0002",
            parameters: parameter
        };
        utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.analyzer"), cmd, function (response) {
            if (response.retCode === 200) {
                res.flag = true;
                res.errorId = 200;
                res.response = response.data;
            } else {
                res.flag = false;
                res.errorId = response.retCode;
            }
            callback(res);
        });
    }

}

module.exports = deviceData;