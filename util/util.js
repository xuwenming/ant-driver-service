function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  // 这里秒钟也取整
  var second = parseInt(time)

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

var Util = {};
// 密码校验，6-20位字母,数字组合
Util.checkPassword = function (v) {
  var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
  if (reg.test(v)) {
    return true;
  }

  return false;
};

// 手机号校验
Util.checkPhone = function (v) {
  var reg = /^0{0,1}(13[0-9]|15[0-9]|18[0-9]|177|176)[0-9]{8}$/;
  if (reg.test(v)) {
    return true;
  }
  return false;
};

Util.isEmpty = function (v) {
  if(v == null) return true;
  var val = (v+'').replace(/(^\s*)|(\s*$)/g, '');
  if (val == "" || val.length == 0) {
    return true;
  }
  return false;
};
Util.clearNoNum = function (value) {
  if(!value) return "";
  value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
  value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是
  value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数

  return value;
};

Util.fenToYuan = function (fen) {
  var yuan = Math.round(fen);
  if (!yuan) {
    return "0.00";
  }
  yuan = yuan.toString();
  var len = yuan.length;
  var before = len > 2 ? yuan.substr(0, yuan.length - 2) : '0';
  var end;
  if (len == 1) {
    end = "0" + yuan;
  } else {
    end = yuan.substr(yuan.length - 2, 2);
  }
  yuan = before + "." + end;
  var re = /(-?\d+)(\d{3})/;
  while (re.test(yuan)) {
    yuan = yuan.replace(re, "$1,$2")
  }
  return yuan;
};

Util.distanceConvert = function (m) {
  if(m === undefined) return '未知';
  if(m < 1000) return m + "m";
  var km = Math.round(m);
  
  km = km.toString();
  var len = km.length;
  var before = len > 3 ? km.substr(0, km.length - 3) : '0';
  var end = km.substr(km.length - 3, 3);
  
  km = before + "." + end;
  return parseFloat(km).toFixed(1) + 'km';
};

Util.arrayRemove = function (arr, v) {
  var index = -1;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == v) index = i;
  }
  if (index > -1) {
    arr.splice(index, 1);
  }
};

Util.format = function (date, fmt) { //author: meizz
  var o = {
    "M+": date.getMonth() + 1,                 //月份
    "d+": date.getDate(),                    //日
    "H+": date.getHours(),                   //小时
    "m+": date.getMinutes(),                 //分
    "s+": date.getSeconds(),                 //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(fmt))
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};
 //获取两点距离
var PI = Math.PI;
function getRad(d) {
  return d * PI / 180.0;
}
Util.getDistance = function (lng1, lat1, lng2, lat2) {
    var radLat1 = getRad(lat1);
    var radLat2 = getRad(lat2);
    var a = radLat1 - radLat2;
    var b = getRad(lng1) - getRad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1)
      * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378137.0;// 取WGS84标准参考椭球中的地球长半径(单位:m)
    s = Math.round(s * 10000) / 10000;
    return s;
  }
  //火星转百度
  Util.marsTobaidu = function (lng,lat){
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var baidu_point = { lng: 0, lat: 0 };
    var x = lng;
    var y = lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    baidu_point.lng = z * Math.cos(theta) + 0.0065;
    baidu_point.lat = z * Math.sin(theta) + 0.006;
    return baidu_point;
  }
  //百度转火星
  Util.baiduTomars = function (lng,lat) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var mars_point = { lng: 0, lat: 0 };
    var x = lng - 0.0065;
    var y = lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    mars_point.lng = z * Math.cos(theta);
    mars_point.lat = z * Math.sin(theta);
    return mars_point;
  }
  
    
  
  

module.exports = {
  formatTime: formatTime,
  Util : Util
}