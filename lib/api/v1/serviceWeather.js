/**
 * Created by song on 2015/7/2.
 */
'use strict';
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var utilCommon = require('./util/common.js');

function serviceWeather(conx) {
  this.get = function (request, userId, token, callback) {

    logger.warn("M-API sendMsg: serviceWeather request");

    var res = JSON.parse(JSON.stringify(result));

    /*res.response = {
     "location": {
     "full": "San Francisco, CA",
     "city": "San Francisco"
     },
     "weather": "Partly Cloudy",
     "temperature": {
     "temperature_string": "66.3 F (19.1 C)",
     "temp_f": 66.3,
     "temp_c": 19.1
     },
     "visibility": {
     "visibility_mi": "10.0",
     "visibility_km": "16.1"
     }
     };

     res.flag = true;
     res.errorId = 200;
     callbackRes(res);
     return;*/

    utilCommon.getUserDevices(conx, userId, function (devices) {
      if (devices === null) {
        callback(res);
        return;
      }
      var pos = null;
      for (var i = 0, len = devices.length; i < len; ++i) {
        var data = devices[i];
        if (data.type.id === "030B08000004" ||
          data.type.id === "060A08000000") {
          pos = data.geo ? data.geo : data.deviceGeo;
          break;
        }
      }
      if (pos === null) {
        callback(res);
        return;
      }
      var cmd = {
        cmdName: "queryWeatherResource",
        cmdCode: "0001",
        parameters: {
          type: "condition",
          query: {
            name: "ll",
            value: {
              "lng": pos.ll[1],
              "lat": pos.ll[0]
            }
          }
        }
      };
      utilCommon.sendMsg(conx, conx.configurator.getConf("services.weather"), cmd, function (response) {
        //logger.debug("get weather: request=" + JSON.stringify(parameter) + ", response="+JSON.stringify(response));
        if (response.retCode === 200 && response.data &&
          response.data.condition &&
          response.data.condition.display_location) {

          var weather = response.data.condition;
          if (weather.weather === "Light Rain Showers") {
            weather.weather = "Light Rain";
          }
          res.flag = true;
          res.errorId = 200;
          res.response = {
            "location": {
              "full": weather.display_location.full,
              "city": weather.display_location.city
            },
            "weather": weather.weather,
            "temperature": {
              "temperature_string": weather.temperature_string,
              "temp_f": weather.temp_f,
              "temp_c": weather.temp_c
            },
            "visibility": {
              "visibility_mi": weather.visibility_mi,
              "visibility_km": weather.visibility_km
            }
          };
        }
        callback(res);
      });
    })
  }
}

module.exports = serviceWeather;