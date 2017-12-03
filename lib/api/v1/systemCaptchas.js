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


        res.weiwiz.MHome.errorId = 200;
        res.weiwiz.MHome.response = {
            captcha: num
        };
        callback(res);
        var cmd = {
            cmdName: "sendMessage",
            cmdCode: "0001",
            parameters: {}
        };
        var service = null;
        var countryCode = phoneNumber.substring(phoneNumber.indexOf("+"), phoneNumber.indexOf(")"));
        if ("+86" === countryCode) {
            phoneNumber = phoneNumber.substring(phoneNumber.indexOf(")") + 1);
            cmd.parameters = {
                PhoneNumbers: phoneNumber,
                SignName: "萤火虫",
                TemplateCode: "SMS_114385442",
                TemplateParam: "{code:\'" + num + "\'}"
            };
            service = conx.configurator.getConfRandom("services.ali_sms");
        }
        else {
            phoneNumber = phoneNumber.replace("(", "");
            phoneNumber = phoneNumber.replace(")", "");
            cmd.parameters = {
                sendTo: phoneNumber,
                conditional: {
                    messageText: "Message from MeHome, please enter " + num + " on the sign up page to verify your account."
                }
            };
            service = conx.configurator.getConfRandom("services.sms");

        }
        utilCommon.sendMsg(conx, service, cmd, function (response) {
            if (response.retCode === 200) {
                //todo
            }
        });
    }
}

module.exports = systemCaptchas;
