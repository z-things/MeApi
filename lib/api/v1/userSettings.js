/**
 * Created by song on 2015/7/2.
 */
var util = require('util');
var _ = require('util');
var async = require('async');
var result = require('./model/http-client-response.json');
var utilCommon = require('./util/common.js');
var mjson = require('./util/mjson.js');
var logger = require('../../mlogger/mlogger.js');
var OPERATION_SCHEMAS = {
    post: {
        "type":"array",
        "items":{
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "value": {"type": "string"}
            },
            "required": [
                "name", "value"
            ]
        }
    }
};
function UserSettings(conx) {
    this.post = function (request, userId, token, callback) {
        conx.messageValidate(request.body, OPERATION_SCHEMAS.post, function (error) {
            var res = JSON.parse(JSON.stringify(result));
            var parameter = request.body;
            if (error) {
                res.weiwiz.MHome.errorId = error.retCode;
                res.weiwiz.MHome.errorMsg = error.description;
                callback(res);
            }
            else {
                async.waterfall([
                        function (innerCallback) {
                            var cmd = {
                                cmdName: "getDevice",
                                cmdCode: "0003",
                                parameters: {
                                    "uuid": userId
                                }
                            };
                            utilCommon.sendMsg(conx,
                                conx.configurator.getConfRandom("services.device_manager"),
                                cmd,
                                function (response) {
                                    if (response.retCode === 200) {
                                        innerCallback(null, response.data[0]);
                                    }
                                    else {
                                        innerCallback({errorId: response.retCode, errorMsg: response.description});
                                    }
                                });
                        }
                    ],
                    function (error, user) {
                        if (error) {
                            res.weiwiz.MHome.errorMsg = error.errorId;
                            res.weiwiz.MHome.errorId = error.errorMsg;
                            callback(res);
                        }
                        else {
                            var found = false;
                            if (util.isNullOrUndefined(user.extra.settings)) {
                                user.extra.settings = [];
                            }
                            parameter.forEach(function (setting, index) {
                                for (var i = 0, len = user.extra.settings.length; i < len; ++i) {
                                    if (user.extra.settings[i].name === setting.name) {
                                        user.extra.settings[i].value = setting.value;
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    user.extra.settings.push(setting);
                                }
                            });

                            var cmd = {
                                cmdName: "deviceUpdate",
                                cmdCode: "0004",
                                parameters: {
                                    "uuid": user.uuid,
                                    "extra.settings": user.extra.settings
                                }
                            };
                            utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.device_manager"), cmd, function (response) {
                                res.weiwiz.MHome.errorMsg = response.description;
                                res.weiwiz.MHome.errorId = response.retCode;
                                callback(res);
                            });
                        }
                    });
            }
        });
    };
    this.get = function (request, userId, token, callback) {
        var res = JSON.parse(JSON.stringify(result));
        utilCommon.getUser(conx, userId,
            function (user) {
                if (user !== null) {
                    res.weiwiz.MHome.errorId = 200;
                    res.weiwiz.MHome.response = {
                        settings: user.extra.settings
                    };
                }
                else {
                    res.weiwiz.MHome.errorId = 203004;
                }
                callback(res);
            });
    };
}

module.exports = UserSettings;
