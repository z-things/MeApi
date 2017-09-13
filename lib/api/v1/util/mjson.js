/**
 * Created by song on 2015/8/18.
 */

//将树形json转为为平铺结构，jsObject为输入json，parentName = ""，result为输出json
var _ = require('lodash');
var transformJS = function (jsObject, path, result) {
    if (_.isArray(jsObject)) {
        result[path] = jsObject;
    }
    else if (_.isObject(jsObject)) {
        _.forIn(jsObject, function (value, key) {
            if ("" === path) {
                transformJS(value, key, result);
            }
            else {
                transformJS(value, path + "." + key, result);
            }
        })
    }
    else {
        result[path] = jsObject;
    }
};

module.exports = {
    transformJS: transformJS
};
