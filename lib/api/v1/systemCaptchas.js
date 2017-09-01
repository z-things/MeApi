/**
 * Created by song on 2015/7/7.
 */
var result = require('./model/http-client-response.json');
var uuid = require('node-uuid');
var async = require('async');
var logger = require('../../mlogger/mlogger.js');
var utilCommon = require('./util/common.js');

function systemCaptchas(conx) {
    this.get = function (request, phoneNumber, callback) {
        logger.debug("************systemCaptchas:" + phoneNumber);
        var res = JSON.parse(JSON.stringify(result));
        if (!utilCommon.validatePhoneNumber(phoneNumber)) {
            res.weiwiz.MHome.errorId = 204002;
            callback(res);
            return;
        }
        var m = 10, n = 1;
        var num = (Math.round(Math.random() * (m - n))).toString() +
            (Math.round(Math.random() * (m - n))).toString() +
            (Math.round(Math.random() * (m - n))).toString() +
            (Math.round(Math.random() * (m - n))).toString();

        phoneNumber = phoneNumber.replace("(", "");
        phoneNumber = phoneNumber.replace(")", "");

        res.weiwiz.MHome.errorId = 200;
        res.weiwiz.MHome.response = {
            captcha: num
        };
        callback(res);
        var cmd = {
            cmdName: "sendMessage",
            cmdCode: "0001",
            parameters: {
                sendTo: phoneNumber,
                conditional: {
                    messageText: "Message from MeHome, please enter " + num + " on the sign up page to verify your account."
                }
            }
        };

        utilCommon.sendMsg(conx, conx.configurator.getConfRandom("services.sms"), cmd, function (response) {
            if (response.retCode === 200) {
                //todo
            }
        });
    }
}

module.exports = systemCaptchas;
