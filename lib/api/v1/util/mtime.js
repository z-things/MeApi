/**
 * Created by song on 2015/10/24.
 */
//加减日期，天为单位
var addDate = function (date, days) {
  var time = date.getTime();
  time = time + days * 24 * 60 * 60 * 1000;
  return new Date(time);
};

//utc时间转换为local时间格式，按偏移量转化
var UTCToLocal = function (date, offset) {
  var time = date.getTime();
  time = time + offset;
  return new Date(time);
};

//local时间转换为utc时间格式，按偏移量转化
var LocalToUTC = function (date, offset) {
  var time = date.getTime();
  time = time - offset;
  return new Date(time);
};

//将整数转换为字符串，按输入位数补0
var fix = function (num, length) {
  return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
};

//将日期按偏移量转换为UTC字符串
var toISOString = function (date, offset) {
  var time = date.getTime();
  time = time - offset;
  var temp = new Date(time);
  return temp.getFullYear() + "-" + fix((temp.getMonth() + 1), 2) + "-" + fix(temp.getDate(), 2) + "T" +
    fix(temp.getHours(), 2) + ":" + fix(temp.getMinutes(), 2) + ":" + fix(temp.getSeconds(), 2) + "." + fix(temp.getMilliseconds(), 3) + "Z";
};

module.exports = {
  addDate: addDate,
  UTCToLocal: UTCToLocal,
  LocalToUTC: LocalToUTC,
  toISOString: toISOString
};