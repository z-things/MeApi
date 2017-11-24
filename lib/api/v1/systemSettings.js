/**
 * Created by song on 2015/7/7.
 */
var _ = require('lodash');
var sysConf = require('../../../config.json');
var result = require('./model/http-client-response.json');
var uuid = require('node-uuid');
var crypto = require('crypto');
var async = require('async');
var fs = require("fs");
var mongoose = require('mongoose');
var logger = require('../../mlogger/mlogger.js');
var wrapperCollection = "wrapperinfo";

var androidAppMarkId = "03e2a810-969c-4d47-9ee4-adf98ff34b4e";
var iOSAppMarkId = "8506305e-3b63-417b-985b-d33b96a148c3";

var wrapperinfoSchema = {
    "platform": {"type": "string"},
    "language": {"type": "string"},
    "products": {
        "type": "object"
    },
    "required": ["platform", "language", "products"]
};

function systemSettings(conx) {
    this.mongoUriString = sysConf.meshblu_server.db_url;
    this.mongoOptions = {};
    var db = mongoose.createConnection(this.mongoUriString, this.mongoOptions);

    this.getLicense = function (request, warpperId, response) {
        response.send(fs.readFileSync("/opt/weiwiz/M-Cloud/lib/api/v1/model/privacy-policy.html", "utf-8"));
    };

    this.getHelp = function (request, warpperId, callback) {
        var res = JSON.parse(JSON.stringify(result));
        res.weiwiz.MHome.errorId = 200;
        res.weiwiz.MHome.response = {
            "device":[
                {
                    "type":"040B08040004",
                    "name":"热水箱控制器",
                    "FAQ":[
                        {
                            "question":"设备如何安装？",
                            "answer":"这样。。。这样。。。。"
                        }
                    ]
                },
                {
                    "type":"030B08000004",
                    "name":"家庭网关",
                    "FAQ":[
                        {
                            "question":"设备如何安装？",
                            "answer":"这样。。。这样。。。。"
                        }
                    ]
                },
                {
                    "type":"040B01000001",
                    "name":"逆流传感器",
                    "FAQ":[
                        {
                            "question":"设备如何安装？",
                            "answer":"这样。。。这样。。。。"
                        }
                    ]
                },
                {
                    "type":"040B09051001",
                    "name":"单开面板",
                    "FAQ":[
                        {
                            "question":"设备如何安装？",
                            "answer":"这样。。。这样。。。。"
                        }
                    ]
                },
                {
                    "type":"040B09050101",
                    "name":"单路接收器",
                    "FAQ":[
                        {
                            "question":"设备如何安装？",
                            "answer":"这样。。。这样。。。。"
                        }
                    ]
                }
            ],
            "other":[
                {
                    "type":"061608000000",
                    "name":"场景",
                    "FAQ":[
                        {
                            "question":"设备如何配置场景？",
                            "answer":"这样。。。这样。。。。"
                        }
                    ]
                }
            ]
        };
        callback(res);
        //response.send(fs.readFileSync("/opt/weiwiz/M-Cloud/lib/api/v1/model/privacy-policy.html", "utf-8"));
    };

    this.getVersion = function (request, markid, versionId, callback) {
        logger.debug("getVersion");
        var res = JSON.parse(JSON.stringify(result));
        res.weiwiz.MHome.errorId = 200;
        var markArray = null;
        if (markid) {
            markArray = markid.split("-");
            if (markArray.length !== 4) {
                res.weiwiz.MHome.errorId = 204007;
                res.weiwiz.MHome.errorMsg = "markid error!";
                callback(res);
                return;
            }
        }
        var versionTest = /^[0-9]{1,2}\.[0-9]{2}\.[0-9]{2}$/;
        var platform = markArray[0];
        var region = markArray[1];
        var language = markArray[2];
        var product = markArray[3];

        var queryCondition = "$products." + product + "." + region + ".versions";
        var matchCondition = "products." + product + "." + region + ".versions.versionCode";
        var match = {
            "platform": platform,
            "language": language
        };

        if (versionId === "latest") {
            match[matchCondition] = {'$gte': 0};
        } else if (versionId && versionTest.test(versionId)) {
            match[matchCondition] = versionId;
        } else {
            res.weiwiz.MHome.errorId = 204007;
            res.weiwiz.MHome.errorMsg = "versionId error!";
            callback(res);
            return;
        }

        db.collection(wrapperCollection).aggregate([
            {"$unwind": queryCondition},
            {"$match": match},
            {"$group": {"_id": "$_id", "productList": {'$push': queryCondition}}}
        ]).toArray(function (err, result) {
            if (err) {
                logger.error(200000, err);
                res.weiwiz.MHome.errorId = 204007;
                res.weiwiz.MHome.errorMsg = "get wrapper info error!";
                callback(res);
            } else {
                if (result.length > 0) {
                    res.weiwiz.MHome.errorId = 200;
                    var versionInfo = result[0].productList[0];
                    res.weiwiz.MHome.response = {
                        url: versionInfo.URL,
                        date: versionInfo.updateDate,
                        md5: null,
                        versionCode: versionInfo.versionCode,
                        versionName: versionInfo.versionName,
                        versionTip: _.join(versionInfo.changeLog, "\n"),
                        forceVersionCode: versionInfo.forceVersionCode,
                        forceVersionName: versionInfo.productName,
                        forceVersionTip: versionInfo.forceVersionTip
                    };
                    callback(res);
                } else {
                    queryCondition = "$products." + product + ".DEFAULT.versions";
                    matchCondition = "products." + product + ".DEFAULT.versions.versionCode";
                    match = {
                        "platform": platform,
                        "language": language
                    };
                    if (versionId === "latest") {
                        match[matchCondition] = {'$gte': 0};
                    } else if (versionId && versionTest.test(versionId)) {
                        match[matchCondition] = versionId;
                    }

                    db.collection(wrapperCollection).aggregate([
                        {"$unwind": queryCondition},
                        {"$match": match},
                        {"$group": {"_id": "$_id", "productList": {'$push': queryCondition}}}
                    ]).toArray(function (err, result) {
                            if (err) {
                                logger.error(200000, err);
                                res.weiwiz.MHome.errorId = 204007;
                                res.weiwiz.MHome.errorMsg = "get wrapper info error!";
                            } else {
                                if (result.length > 0) {
                                    res.weiwiz.MHome.errorId = 200;
                                    var versionInfo = result[0].productList[0];
                                    res.weiwiz.MHome.response = {
                                        url: versionInfo.URL,
                                        date: versionInfo.updateDate,
                                        md5: null,
                                        versionCode: versionInfo.versionCode,
                                        versionName: versionInfo.versionName,
                                        versionTip: _.join(versionInfo.changeLog, "\n"),
                                        forceVersionCode: versionInfo.forceVersionCode,
                                        forceVersionName: versionInfo.productName,
                                        forceVersionTip: versionInfo.forceVersionTip
                                    };
                                } else {
                                    res.weiwiz.MHome.errorId = 204007;
                                    res.weiwiz.MHome.errorMsg = "cannot find any wrapper info!";
                                }
                                callback(res);
                            }
                        }
                    );
                }
            }
        });
    }
}

module.exports = systemSettings;
