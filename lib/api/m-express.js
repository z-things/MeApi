/**
 * Created by song on 2015/7/2.
 */
'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var https = require('https');
var path = require('path');
var passport = require('passport');
var logger = require('../mlogger/mlogger.js');
var fs = require('fs');
var util = require('util');
var BearerStrategy = require('passport-http-bearer').Strategy;
var messageV1 = require('./v1/model/virtual-device-request.json');

var UsersV1 = require('./v1/users.js');
var UserForgotV1 = require('./v1/userForgot.js');
var SystemTokensV1 = require('./v1/systemTokens.js');
var SystemCaptchasV1 = require('./v1/systemCaptchas.js');
var SystemSettingsV1 = require('./v1/systemSettings.js');
var DevicesV1 = require('./v1/devices.js');
var DevicesMeV1 = require('./v1/devicesMe.js');
var DeviceActionsV1 = require('./v1/deviceActions.js');
var DeviceDataV1 = require('./v1/deviceData.js');
var DeviceItemV1 = require('./v1/deviceItem.js');
var DevicesMeItemV1 = require('./v1/devicesMeItem.js');
var ServiceWeatherV1 = require('./v1/serviceWeather.js');
var ServiceEnergyV1 = require('./v1/serviceEnergy.js');
var ServiceLightingV1 = require('./v1/serviceLighting.js');
var TimerV1 = require('./v1/timer.js');
var SceneV1 = require('./v1/scene.js');
var EventsV1 = require('./v1/events.js');
var EventSettingsV1 = require('./v1/eventSettings.js');
var MessagesMeV1 = require('./v1/messagesMe.js');
var MessagesSmartData = require('./v1/messagesSmartData.js');
var UserSettings = require('./v1/userSettings.js');

var VirtualDevice = require('../virtual-device').VirtualDevice;
var responseBody = require('./v1/model/http-client-response.json');

var resourceError = [208001, 209001, 200006];
var serverInnerError = [200003, 200004, 200005, 203003, 203005, 203006, 207002, 214001];

function included(array, item) {
  var found = false;
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === item) {
      found = true;
      break;
    }
  }
  return found;
}

function MExpress(conx, uuid, token, configurator) {
  this.sendMsg = function (response, result) {
    response.statusCode = 200;
    response.statusMessage = "request success.";
    if (result.weiwiz.MHome.errorId !== 200) {
      response.statusMessage = result.weiwiz.MHome.errorMsg;
      if (included(resourceError, result.weiwiz.MHome.errorId)) {
        response.statusCode = 404;
        response.statusMessage = "resource not found.";
      }
      else if (included(serverInnerError, result.weiwiz.MHome.errorId)) {
        response.statusCode = 500;
        response.statusMessage = "server internal error.";
      }
    }
    if (util.isNullOrUndefined(result.weiwiz.MHome.errorMsg)
      || result.weiwiz.MHome.errorMsg === "") {
      result.weiwiz.MHome.errorMsg = logger.getErrorInfo(result.weiwiz.MHome.errorId);
    }
    else if (util.isObject(result.weiwiz.MHome.errorMsg)) {
      result.weiwiz.MHome.errorMsg = JSON.stringify(result.weiwiz.MHome.errorMsg);
    }
    logger.warn({
      statusCode: response.statusCode,
      statusMessage: response.statusMessage
    });
    logger.debug(result);
    response.send(result);
  };
  this.getUserToken = function (req) {
    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        var scheme = parts[0]
          , credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          return credentials;
        }
      } else {
      }
    }
    return null;
  };
  this.getUserId = function (req) {
    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        var scheme = parts[0]
          , credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          var partsToken = credentials.split('_');
          if (partsToken.length === 2) {
            return partsToken[0];
          }
        }
      } else {
      }
    }
    return null;
  };
  this.listen = function () {
    var self = this;
    var app = express();
    app.use(bodyParser.urlencoded({extended: true}));      // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());     // parse application/json
    app.use(express.static(path.join(__dirname, 'public')));
    //Users(tested)
    var usersV1Case = new UsersV1(self);
    app.post('/m-home/rest/v1/Users', function (request, response) {
      usersV1Case.post(request, function (result) {
        self.sendMsg(response, result);
      });
    });
    //(tested)
    app.put('/m-home/rest/v1/Users/me',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        usersV1Case.put(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });
    //(tested)
    app.get('/m-home/rest/v1/Users/me',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        usersV1Case.get(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });

    //SystemTokens(tested)
    var systemTokensV1Case = new SystemTokensV1(self);
    app.post('/m-home/rest/v1/system/tokens', function (request, response) {
      systemTokensV1Case.post(request, function (result) {
        self.sendMsg(response, result);
      });
    });

    //user forgot(tested)
    var userForgotV1Case = new UserForgotV1(self);
    app.get('/m-home/rest/v1/system/settings/user/forgot', function (request, response) {
      logger.debug(request.query["proof"]);
      userForgotV1Case.get(request, request.query["proof"], function (result) {
        self.sendMsg(response, result);
      });
    });
    var userSettingsV1Case = new UserSettings(self);
    app.post('/m-home/rest/v1/users/me/settings',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        userSettingsV1Case.post(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });
    app.get('/m-home/rest/v1/users/me/settings',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        userSettingsV1Case.get(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });
    //(tested)
    app.post('/m-home/rest/v1/system/settings/user/forgot/:userId', function (request, response) {
      userForgotV1Case.post(request, request.params.userId, request.body.captcha, function (result) {
        self.sendMsg(response, result);
      });
    });

    //systemSettings(todo)
    var systemSettingsV1Case = new SystemSettingsV1(self);
    app.get('/m-home/rest/v1/system/settings/wrappers/:markid/license', function (request, response) {
      systemSettingsV1Case.getLicense(request, request.params.markid, response);
    });
    //todo
    app.get('/m-home/rest/v1/system/settings/wrappers/:markid/helps', function (request, response) {
      systemSettingsV1Case.getHelp(request, request.params.markid, function (result) {
        self.sendMsg(response, result);
      });
    });
    app.get('/m-home/rest/v1/system/settings/wrappers/:markid/versions/:versionId', function (request, response) {
      systemSettingsV1Case.getVersion(request, request.params.markid, request.params.versionId, function (result) {
        logger.debug(result);
        self.sendMsg(response, result);
      });
    });

    //devicesMe(tested)
    var devicesMeV1Case = new DevicesMeV1(self);
    app.post('/m-home/rest/v1/devices/me',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        devicesMeV1Case.post(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });
    //(tested)
    app.get('/m-home/rest/v1/devices/me',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        logger.debug(request.query["type"]);
        devicesMeV1Case.get(request, self.getUserId(request), self.getUserToken(request), null, request.query["type"], function (result) {
          if (result.weiwiz.MHome.errorId === 203004) {
            result.weiwiz.MHome.errorId = 200;
            result.weiwiz.MHome.response = [];
          }
          self.sendMsg(response, result);
        });
      });

    //(tested)
    app.get('/m-home/rest/v1/devices/me/:deviceId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        devicesMeV1Case.get(request, self.getUserId(request), self.getUserToken(request), request.params.deviceId, null, function (result) {
          self.sendMsg(response, result);
        });
      });
    //(tested)
    app.put('/m-home/rest/v1/devices/me/:deviceId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        devicesMeV1Case.put(request, self.getUserId(request), self.getUserToken(request), request.params.deviceId, function (result) {
          self.sendMsg(response, result);
        });
      });
    //(tested)
    app.delete('/m-home/rest/v1/devices/me/:deviceId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        devicesMeV1Case.delete(request, self.getUserId(request), self.getUserToken(request), request.params.deviceId, function (result) {
          self.sendMsg(response, result);
        });
      });

    //device action
    var deviceActionsV1Case = new DeviceActionsV1(self);
    app.post('/m-home/rest/v1/devices/me/actions',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        deviceActionsV1Case.multiPost(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });
    app.post('/m-home/rest/v1/devices/me/:deviceId/actions',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        deviceActionsV1Case.post(request, self.getUserId(request), self.getUserToken(request), request.params.deviceId, function (result) {
          self.sendMsg(response, result);
        });
      });

    //supported devices//(TO_DO)
    var devicesV1Case = new DevicesV1(self);
    app.get('/m-home/rest/v1/devices',
      function (request, response) {
        devicesV1Case.get(request, self.getUserId(request), function (result) {
          self.sendMsg(response, result);
        });
      });

    //device data
    var deviceDataV1Case = new DeviceDataV1(self);
    app.get('/m-home/rest/v1/datas/reports/me/:deviceId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        deviceDataV1Case.get(request, self.getUserId(request), self.getUserToken(request), request.params.deviceId, function (result) {
          self.sendMsg(response, result);
        });
      });
    //(TO_DO)
    app.post('/m-home/rest/v1/datas/reports/me/:deviceId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        deviceDataV1Case.post(request, self.getUserId(request), self.getUserToken(request), request.params.deviceId, function (result) {
          self.sendMsg(response, result);
        });
      });

    //device item（tested）
    var deviceItemV1Case = new DeviceItemV1(self);
    app.get('/m-home/rest/v1/devices/me/:deviceId/items',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        deviceItemV1Case.get(request, self.getUserId(request), self.getUserToken(request), request.params.deviceId, function (result) {
          self.sendMsg(response, result);
        });
      });

    //devicesMe item（tested）
    var devicesMeItemV1Case = new DevicesMeItemV1(self);
    app.get('/m-home/rest/v1/devices/me/:deviceId/items/:itemName',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        devicesMeItemV1Case.get(request, self.getUserId(request), self.getUserToken(request), request.params.deviceId, request.params.itemName, function (result) {
          self.sendMsg(response, result);
        });
      });
    // service lighting
    var serviceLightingV1 = new ServiceLightingV1(self);
    app.get('/m-home/rest/v1/services/lighting',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        serviceLightingV1.get(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });
    // service energy
    var serviceEnergyV1Case = new ServiceEnergyV1(self);
    app.get('/m-home/rest/v1/services/energy',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        /* var result = {
         "weiwiz": {
         "MHome": {
         "response": {
         "icons":{
         "Grip":3, 		// 1:空闲,2:取电，3：发电
         "MeRFCT":2,		// 0:无设备,1:设备正常，2：设备异常
         "PV":1,			// 0:无设备,1:设备正常
         "MeInverter":2,	// 0:无设备,1:设备正常, 2:设备异常
         "MeStroage":2,	// 0:无设备,1:设备正常, 2:设备异常
         "MeStroageBattery":100,	//设备充电百分比
         "MeBoost":2,	    // 0:无设备,1:设备正常, 2:设备异常
         "Load":3		// 0:无负载,1:仅热水器负载, 2:仅其他家庭负载，3：全负载
         },
         "lines":{
         "G2R":2,		// 0:空闲,1:电网取电，2：太阳能发电
         "R2L":2,		// 0:空闲,1:电网取电，2：太阳能取电
         "PV2I":1,		// 0:空闲,1：太阳能发电
         "PV2S":2,		// 0:空闲,1:太阳能充电，2：放电
         "S2B":2,		// 0:空闲,1:太阳充电，2：放电
         "I2B":1,		// 0:空闲,1:太阳能取电，
         "R2B":1,		// 0:空闲,1:电网取电，
         "B2L":2,		// 0:空闲,1:电网取电，2：太阳能取电
         "I2R":2		// 0:空闲,			  1：太阳能发电
         }
         },
         "errorId": 200,
         "errorMsg": ""
         }
         }
         };
         self.sendMsg(response, result);*/
        serviceEnergyV1Case.get(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });
    //service weather todo
    var serviceWeatherV1Case = new ServiceWeatherV1(self);
    app.get('/m-home/rest/v1/services/weather',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        serviceWeatherV1Case.get(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });
    //scene
    var sceneV1Case = new SceneV1(self);
    app.get('/m-home/rest/v1/flows/me',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        sceneV1Case.get(request, self.getUserId(request), "*", function (result) {
          self.sendMsg(response, result);
        });
      });

    app.get('/m-home/rest/v1/flows/me/:flowId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        sceneV1Case.get(request, self.getUserId(request), request.params.flowId, function (result) {
          self.sendMsg(response, result);
        });
      });

    app.post('/m-home/rest/v1/flows/me',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        sceneV1Case.post(request, self.getUserId(request), function (result) {
          self.sendMsg(response, result);
        });
      });

    app.put('/m-home/rest/v1/flows/me/:flowId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        sceneV1Case.put(request, self.getUserId(request), request.params.flowId, function (result) {
          self.sendMsg(response, result);
        });
      });

    app.delete('/m-home/rest/v1/flows/me/:flowId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        sceneV1Case.delete(request, self.getUserId(request), request.params.flowId, function (result) {
          self.sendMsg(response, result);
        });
      });

    app.post('/m-home/rest/v1/flows/me/:flowId/actions',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        sceneV1Case.action(request, self.getUserId(request), request.params.flowId, function (result) {
          self.sendMsg(response, result);
        });
      });
    app.post('/m-home/rest/v1/flows/me/:flowId/settings',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        sceneV1Case.settings(request, self.getUserId(request), request.params.flowId, function (result) {
          self.sendMsg(response, result);
        });
      });

    //timer
    var timerV1Case = new TimerV1(self);
    //tested
    app.get('/m-home/rest/v1/flows/me/device/:deviceId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        timerV1Case.get(request, self.getUserId(request), request.params.deviceId, "*", function (result) {
          self.sendMsg(response, result);
        });
      });
    //tested
    app.get('/m-home/rest/v1/flows/me/device/:deviceId/:flowId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        timerV1Case.get(request, self.getUserId(request), request.params.deviceId, request.params.flowId, function (result) {
          self.sendMsg(response, result);
        });
      });
    //tested
    app.post('/m-home/rest/v1/flows/me/device/:deviceId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        timerV1Case.post(request, self.getUserId(request), request.params.deviceId, function (result) {
          self.sendMsg(response, result);
        });
      });
    //todo
    app.get('/m-home/rest/v1/flows/me/device/:deviceId/timer/next',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        timerV1Case.getNextTime(request, self.getUserId(request), request.params.deviceId, function (result) {
          self.sendMsg(response, result);
        });
      });

    //tested
    app.put('/m-home/rest/v1/flows/me/device/:deviceId/:flowId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        timerV1Case.put(request, self.getUserId(request), request.params.deviceId, request.params.flowId, function (result) {
          self.sendMsg(response, result);
        });
      });
    //tested
    app.delete('/m-home/rest/v1/flows/me/device/:deviceId/:flowId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        timerV1Case.delete(request, self.getUserId(request), request.params.deviceId, request.params.flowId, function (result) {
          self.sendMsg(response, result);
        });
      });
    //tested
    app.post('/m-home/rest/v1/flows/me/device/:deviceId/:flowId/actives',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        timerV1Case.active(request, self.getUserId(request), request.params.deviceId, request.params.flowId, function (result) {
          self.sendMsg(response, result);
        });
      });

    //captchas（tested）
    var systemCaptchasV1Case = new SystemCaptchasV1(self);
    app.get('/m-home/rest/v1/system/captchas/:phoneNumber',
      function (request, response) {
        systemCaptchasV1Case.get(request, request.params.phoneNumber, function (result) {
          self.sendMsg(response, result);
        });
      });

    //events
    var eventsV1Case = new EventsV1(self);
    app.get('/m-home/rest/v1/events/me',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        eventsV1Case.getLatest(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });
    app.get('/m-home/rest/v1/events/me/:deviceId',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        eventsV1Case.get(request, self.getUserId(request), self.getUserToken(request), request.params.deviceId, function (result) {
          self.sendMsg(response, result);
        });
      });

    var eventSettingsV1Case = new EventSettingsV1(self);
    //(tested)
    app.get('/m-home/rest/v1/events/me/settings',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        eventSettingsV1Case.get(request, self.getUserId(request), self.getUserToken(request), null, function (result) {
          self.sendMsg(response, result);
        });
      });
    //(tested)
    app.get('/m-home/rest/v1/events/me/settings/:settingName',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        eventSettingsV1Case.get(request, self.getUserId(request), self.getUserToken(request), request.params.settingName, function (result) {
          self.sendMsg(response, result);
        });
      });
    //(tested)
    app.put('/m-home/rest/v1/events/me/settings/:settingName',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        eventSettingsV1Case.put(request, self.getUserId(request), self.getUserToken(request), request.params.settingName, function (result) {
          self.sendMsg(response, result);
        });
      });
    var messagesMeV1Case = new MessagesMeV1(self);
    app.post('/m-home/rest/v1/messages/me',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        messagesMeV1Case.post(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });
    app.get('/m-home/rest/v1/messages/me',
      passport.authenticate('bearer', {session: false}),
      function (request, response) {
        messagesMeV1Case.get(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });
    //todo
    var messagesSmartDataCase = new MessagesSmartData(self);
    app.put('/m-home/rest/v1/smart/data',
      //passport.authenticate('bearer', {session: false}),
      function (request, response) {
        messagesSmartDataCase.put(request, self.getUserId(request), self.getUserToken(request), function (result) {
          self.sendMsg(response, result);
        });
      });
    //todo
    app.get('/m-home/rest/v1/smart/data/:uuid',
      //passport.authenticate('bearer', {session: false}),
      function (request, response) {
        messagesSmartDataCase.get(request, self.getUserId(request), self.getUserToken(request), request.params.uuid, function (result) {
          self.sendMsg(response, result);
        });
      });

    //http
    var httpServer = http.createServer(app).listen(self.configurator.getConf("self.extra.listen_port.http"), function () {
      var host = httpServer.address().address;
      var port = httpServer.address().port;
      logger.debug('Listening at https://' + host + ':' + port);
    });
    //https
    var options = {
      pfx: fs.readFileSync(path.join(__dirname, './tech-artisan.net.pfx')),
      passphrase: '214457634860363'
    };
    var httpsServer = https.createServer(options, app).listen(self.configurator.getConf("self.extra.listen_port.https"), function () {
      var host = httpsServer.address().address;
      var port = httpsServer.address().port;
      logger.debug('Listening at https://' + host + ':' + port);
    });
  };
  VirtualDevice.call(this, conx, uuid, token, configurator);
}

util.inherits(MExpress, VirtualDevice);

MExpress.prototype.init = function () {
  var self = this;
  self.setMaxListeners(0);
  passport.use(new BearerStrategy(
    function (token, done) {
      var msg = JSON.parse(JSON.stringify(messageV1));
      msg.devices = self.configurator.getConfRandom("services.authentication_center");
      msg.payload.cmdName = "checkToken";
      msg.payload.cmdCode = "0001";
      msg.payload.parameters = {"token": token};
      self.message(msg, function (responseMessage) {
        try {
          var body = JSON.parse(JSON.stringify(responseBody));
          body.weiwiz.MHome.errorId = 204005;
          body.weiwiz.MHome.errorMsg = logger.getErrorInfo(body.weiwiz.MHome.errorId, "en");
          if (responseMessage) {
            if (responseMessage.retCode && responseMessage.retCode === 200) {
              return done(null, {"token": token});
            }
            else {
              return done(null, false, body);
            }
          } else {
            return done(null, false, body);
          }
        } catch (err) {
          logger.error(200000, {"info": "checkUserToken: " + err.message});
          return done(null, false, responseMessage);
        }
      });
    }
  ));
  self.listen();
};
module.exports = {
  Service: MExpress
};


