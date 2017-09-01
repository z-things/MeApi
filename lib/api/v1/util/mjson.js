/**
 * Created by song on 2015/8/18.
 */

//将树形json转为为平铺结构，jsObject为输入json，parentName = ""，result为输出json
var transformJS = function (jsObject, parentName, result) {

    for (var i in jsObject) {
        var type = typeof ( jsObject [i]);
        if (type === "object") {
            if (parentName !== "") {
                this.transformJS(jsObject[i], parentName + "." + i, result);
            }
            else {
                this.transformJS(jsObject[i], i, result);
            }
        } else {
            if (parentName !== "") {
                result[parentName + "." + i] = jsObject[i];
            }
            else {
                result[i] = jsObject[i];
            }
        }
    }

};

module.exports = {
    transformJS: transformJS
};
