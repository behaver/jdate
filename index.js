'use strict';

/**
 * JDate
 *
 * JDate 对象用于处理儒略日数值
 * 
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 */
module.exports = function (d) {

    // 缓存数据
    var cacheData = {};

    /**
     * 设置或获取时间对象
     * @return {[type]} [description]
     */
    this.date = function (d) {
        if (d === undefined) {
            return cacheData.date;
        } else if (d.constructor === Date) {
            cacheData.date = d;
            return this;
        } else {
            throw Error("Illegality Parameters.");
        }
    };

    /**
     * 获取当前时间的儒略日 （世界时标准）
     * @return {number} 儒略日
     */
    this.getJD = function () {
        if (cacheData.JD === undefined) {
            if (cacheData.date === undefined) {
                throw Error('No Date.');
            }
            var date = cacheData.date;
            var month = date.getUTCMonth() + 1;
            var year = date.getUTCFullYear();
            var day = date.getUTCDate();
            if (month <= 2) {
                month += 12;
                year --;
            }
            // 判断是否为格里高利历日，是则加百年闰
            if (date.getUTCFullYear() * 372 + month * 31 + day >= 588829) {
                var a = parseInt(year / 100);
                var c = 2 - a + parseInt(a / 4);
            } else {
                c = 0;
            }

            var d = day + (date.getUTCHours() * 3600000 + date.getUTCMinutes() * 60000 + date.getUTCSeconds() * 1000 + date.getUTCMilliseconds()) / 86400000;
            cacheData.JD = parseInt(365.2500001 * (year + 4716)) + parseInt(30.6 * (month + 1)) + d + c - 1524.5;
        }

        return cacheData.JD;
    };

    /**
     * 设置当前日期的儒略日 （世界时标准）
     * @param {number} jd 儒略日
     */
    this.setJD = function (jd, save_cache) {
        if (typeof(jd) === 'number') {
            if (save_cache) cacheData.JD = jd;
            else cacheData = { JD: jd };

            jd += 0.5;
            jd += '';
            var jds = jd.split('.');
            if (jds[1] === undefined) jds[1] = 0;
            jds[0] = parseInt(jds[0]);
            jds[1] = parseFloat('0.' + jds[1]);
            // console.log(jds);
            var A = 0;
            if (jds[0] < 2299161) {
                A = jds[0];
            } else {
                var a = parseInt((jds[0] - 1867216.25) / 36524.25);
                A = jds[0] + 1 + a - parseInt(a / 4);
            }

            var B = A + 1524;
            var C = parseInt((B - 122.1) / 365.25);
            var D = parseInt(365.25 * C);
            var E = parseInt((B - D) / 30.6001);

            // 计算月份
            var month = (E < 14) ? E - 1 : E - 13;
            // 计算年
            var year = (month > 2) ? C - 4716 : C - 4715;

            var d = B - D - parseInt(30.6001 * E) + jds[1];
            // 计算日期
            var day = parseInt(d);
            // 计算小时
            var hours = parseInt(d = (d - day) * 24);
            // 计算分钟
            var minutes = parseInt(d = (d - hours) * 60);
            // 计算秒
            var seconds = parseInt(d = (d - minutes) * 60);
            // 计算毫秒
            var milliseconds = parseInt(d = (d - seconds) * 1000 + 0.5);
            if (milliseconds >= 1000) milliseconds -= 1000, seconds++;
            if (seconds >= 60)  seconds -= 60,  minutes++;
            if (minutes >= 60)  minutes -= 60,  hours++;
            if (hours >= 24) hours -= 24, day++;

            var date = new Date('2000/1/1');

            date.setUTCDate(day);
            date.setUTCMonth(month - 1);
            date.setUTCFullYear(year);
            date.setUTCMilliseconds(milliseconds);
            date.setUTCSeconds(seconds);
            date.setUTCMinutes(minutes);
            date.setUTCHours(hours);

            cacheData.date = date;

        } else {
            throw Error('Illegality Parameters.');
        }
        return this;
    }

    /**
     * 获取当前时间的儒略历书日 （力学时标准）
     * @return {number} 儒略历书日
     */
    this.getJDE = function () {
        if (cacheData.JDE === undefined) {
            cacheData.JDE = this.getJD() + this.getTDTimeDelay() / 86400.0;
        }
        return cacheData.JDE;
    }

    /**
     * 设置当前时间的儒略历书日 （以力学时为标准）
     * @param {number} jde 儒略历书日
     */
    this.setJDE = function (jde) {
        cacheData = { JDE: jde };
        // 先转化成世界时儒略日
        var jd = jde - this.getTDTimeDelay() / 86400.0;
        this.setJD(jd, true);
        return this;
    }

    /**
     * 获取当前时间的儒略历书日幂函数
     * @param  {[type]} pow [description]
     * @return {[type]}     [description]
     */
    this.getJDEP = function (pow) {
        if (cacheData.JDEP === undefined) cacheData.JDEP = [];
        if (cacheData.JDEP[pow] === undefined) {
            cacheData.JDEP[pow] = Math.pow(this.getJDE(), pow);
        }
        return cacheData.JDEP[pow];
    }

    /**
     * 获取当前日期的儒略千年数
     * @return {number} 儒略千年数
     */
    this.getJDET = function () {
        if (cacheData.JDET === undefined) {
            cacheData.JDET = (this.getJDE() - 2451545.0) / 365250;
        }
        return cacheData.JDET;
    }

    /**
     * 获取当前时间的儒略千年数幂函数
     * @param  {[type]} pow [description]
     * @return {[type]}     [description]
     */
    this.getJDETP = function (pow) {
        if (cacheData.JDETP === undefined) cacheData.JDETP = [];
        if (cacheData.JDETP[pow] === undefined) {
            cacheData.JDETP[pow] = Math.pow(this.getJDET(), pow);
        }
        return cacheData.JDETP[pow];
    }

    /**
     * 设置当前时间的儒略历书日 （以力学时为标准）
     * @param {number} jdec 儒略历书日
     */
    this.setJDEC = function (jdec) {
        cacheData = { JDEC: jdec };
        this.setJDE(jdec * 36525 + 2451545.0);
        return this;
    }

    /**
     * 获取当前日期的儒略世纪数
     * @return {number} 儒略世纪数
     */
    this.getJDEC = function () {
        if (cacheData.JDEC === undefined) {
            cacheData.JDEC = (this.getJDE() - 2451545.0) / 36525;
        }
        return cacheData.JDEC;
    }

    /**
     * 获取当前时间的儒略世纪数幂函数
     * @param  {[type]} pow [description]
     * @return {[type]}     [description]
     */
    this.getJDECP = function (pow) {
        if (cacheData.JDECP === undefined) cacheData.JDECP = [];
        if (cacheData.JDECP[pow] === undefined) {
            cacheData.JDECP[pow] = Math.pow(this.getJDEC(), pow);
        }
        return cacheData.JDECP[pow];
    }

    /**
     * 获取当前时间力学时延迟于世界时的时差
     * @return {number} 时差 单位秒
     */
    this.getTDTimeDelay = function () {
        var data = [[-4000,108371.7,-13036.8,392,0],[-500,17201,-627.82,16.17,-0.3413],[-150,12200.6,-346.41,5.403,-0.1593],[150,9113.8,-328.13,-1.647,0.0377],[500,5707.5,-391.41,0.915,0.3145],[900,2203.4,-283.45,13.034,-0.1778],[1300,490.1,-57.35,2.085,-0.0072],[1600,120,-9.81,-1.532,0.1403],[1700,10.2,-0.91,0.51,-0.037],[1800,13.4,-0.72,0.202,-0.0193],[1830,7.8,-1.81,0.416,-0.0247],[1860,8.3,-0.13,-0.406,0.0292],[1880,-5.4,0.32,-0.183,0.0173],[1900,-2.3,2.06,0.169,-0.0135],[1920,21.2,1.69,-0.304,0.0167],[1940,24.2,1.22,-0.064,0.0031],[1960,33.2,0.51,0.231,-0.0109],[1980,51,1.29,-0.026,0.0032],[2000,64.7,-1.66,5.224,-0.2905],[2150,279.4,732.95,429.579,0.0158],[6000]];
        // 世界时年，可带小数点
        var year_jd = cacheData.JD === undefined ? cacheData.JDE : cacheData.JD;
        var year = (year_jd - 2451545) / 365.2425 + 2000;
        // 求出的i为大端值索引
        for (var i = 0; i < data.length - 1 && year > data[i][0]; i++);

        if (i === 0) { // 年份小于-4000
            console.log('目前暂时不支持公元前4000以前的精确计算。');
            return 0;
        } else if (year > 6000) {
            console.log('目前暂时不支持公元6000以后的精确计算。');
            return 0;
        } else {
            // console.log(year, data[i][0], data[i - 1][0]);
            var t1 =  (year - data[i - 1][0]) / (data[i][0] - data[i - 1][0]) * 10;
            var t2 = t1 * t1;
            var t3 = t2 * t1;
            return data[i - 1][1] + data[i - 1][2] * t1 + data[i - 1][3] * t2 + data[i - 1][4] * t3;
        }
    }

    if (d != undefined) {    
        if (d.constructor === Date) {
            cacheData.date = d;
        } else if (typeof(d) === 'number') {
            this.setJD(d);
        }
    } else cacheData.date = new Date;
};