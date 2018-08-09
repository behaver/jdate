'use strict';

const calcUTDelay = require('@behaver/calc-ut-delay');

/**
 * 计算世界时 UT 延后于力学时 TD 的时间，即 ΔT = TD - UT 
 *
 * @private
 * @param  {Number} jd    儒略日或儒略历书日数值
 * @return {Number}       延迟时间（单位：儒略日）
 */
const calc_ut_delay = function(jd) {
  return calcUTDelay((jd - 2451545) / 365.2425 + 2000) / 86400;
}

/**
 * JDate
 *
 * JDate 对象用于处理儒略日数值
 * 
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 2.1.4
 * @license MIT
 */
class JDate {

  /**
   * 构造函数
   * 
   * @param  {Mixed}  d     需构造的 日期对象 或 日期数值
   * @param  {String} dtype 日期值的类型
   */
  constructor(d, dtype = 'jd') {
    if (typeof(dtype) !== 'string') throw Error('The param dtype should be a String.');
    this.cache = {};
    
    if (d === undefined) this.cache.date = new Date();
    else if (typeof(d) === 'number' || d.constructor === Date) {
      switch (dtype.toLowerCase()) {
        case 'date' :
          this.date = d;
          break;
        case 'jd' :
          this.JD = d;
          break;
        case 'jde' :
          this.JDE = d;
          break;
        case 'j2000' :
          this.J2000 = d;
          break;
        case 'jdec' :
          this.JDEC = d;
          break;
        case 'jdet' :
          this.JDET = d;
          break;
        case 'bepoch':
          this.BEpoch = d;
          break;
        case 'jepoch':
          this.JEpoch = d;
          break;

        default :
          throw Error('Unkown param dtype.');
      }
    } else throw Error('Illegality Parameters.');
  }

  /**
   * 获取 Date 对象
   * 
   * @return {Date}     返回 Date 对象
   */
  get date() {
    return this.cache.date;
  }

  /**
   * 设置 Date 对象
   * 
   * @param {Date} date 需设置的 Date 对象
   * @return {JDate}    返回 this 引用
   */
  set date(date) {
    if (date.constructor !== Date) throw Error("Illegality Parameters.");

    this.cache = { date };

    return this;
  }

  /**
   * 获取儒略日（世界时标准）
   *
   * 该方法对 正数年 或者 负数年 都有效
   * 
   * @return {Number}   儒略日
   */
  get JD() {
    if (this.cache.JD === undefined) {
      let date = this.cache.date;
      let month = date.getUTCMonth() + 1;
      let year = date.getUTCFullYear();
      let day = date.getUTCDate();
      if (month < 3) { // 如果日期在 1月 或者 2月 ，则被看做是前一年的 13月 或者 14月
        month += 12;
        year --;
      }

      let a, c;
      if (date.getUTCFullYear() * 372 + month * 31 + day >= 588829) { // 该时间是采用格里高利历的日期，需要加百年闰
        a = year / 100 | 0;
        c = 2 - a + (a / 4 | 0);
      } else { // 采用儒略历的日期
        c = 0;
      }

      let d = day + (date.getUTCHours() * 3600000 + date.getUTCMinutes() * 60000 + date.getUTCSeconds() * 1000 + date.getUTCMilliseconds()) / 86400000;
      this.cache.JD = (365.2500001 * (year + 4716) | 0) + (30.6 * (month + 1) | 0) + d + c - 1524.5;
    }

    return this.cache.JD;
  }

  /**
   * 设置儒略日（世界时标准）
   * 
   * @param {Number} jd   儒略日
   * @return {JDate}      返回 this 引用
   */
  set JD(jd) {
    if (typeof(jd) !== 'number') throw Error('Illegality Parameters.');

    // 儒略日数值必须非负
    if (jd < 0) throw Error('JD must > 0.');

    this.cache = { JD: jd };

    // 分界点相对后移12时，由中午12点分界，改为次日午夜0点分界
    jd += 0.5;

    // jd 整数部分，用于以 日 为单位粒度的计算
    // | 0 表示对数值取整数部分，等同parseInt()
    let jd_int = jd | 0;

    // jd 小数部分，用于 日 单位粒度内的计算
    let jd_dec = jd % 1;

    // 儒略日数 转换 Date 计算
    let A = 0;
    if (jd_int < 2299161) A = jd_int;
    else {
      let a = (jd_int - 1867216.25) / 36524.25 | 0;
      A = jd_int + 1 + a - (a / 4 | 0);
    }
    let B = A + 1524;
    let C = (B - 122.1) / 365.25 | 0;
    let D = 365.25 * C | 0;
    let E = (B - D) / 30.6 | 0;

    // 计算年月（日单位粒度外）
    let month = (E < 14) ? E - 1 : E - 13;
    let year = (month > 2) ? C - 4716 : C - 4715;

    // 计算日内时间（日单位粒度内）
    let d = B - D - (30.6001 * E | 0) + jd_dec;
    let day = d | 0;
    let h = (d - day) * 24;
    let hours = h | 0;
    let m = (h - hours) * 60;
    let minutes = m | 0;
    let s = (m - minutes) * 60;
    let seconds = s | 0;
    let ms = (s - seconds) * 1000 + 0.5;
    let milliseconds = ms | 0;

    // ms + 0.5 防止溢出
    if (milliseconds >= 1000) milliseconds -= 1000, seconds++;
    if (seconds >= 60) seconds -= 60,  minutes++;
    if (minutes >= 60) minutes -= 60,  hours++;
    if (hours >= 24) hours -= 24, day++;

    let date = new Date('2000/1/1');
    date.setUTCDate(day);
    date.setUTCMonth(month - 1);
    date.setUTCFullYear(year);
    date.setUTCMilliseconds(milliseconds);
    date.setUTCSeconds(seconds);
    date.setUTCMinutes(minutes);
    date.setUTCHours(hours);

    this.cache.date = date;

    return this;
  }

  /**
   * 获取儒略历书日（力学时标准）
   * 
   * @return {Number}     返回儒略历书日
   */
  get JDE() {
    if (this.cache.JDE === undefined) {
      let jd = this.JD;

      // 每儒略日为86400秒
      this.cache.JDE = jd + calc_ut_delay(jd);
    }

    return this.cache.JDE;
  }

  /**
   * 设置儒略历书日（力学时标准）
   * 
   * @param {Number} jde  需设置的儒略历书日
   * @return {JDate}      返回 this 引用
   */
  set JDE(jde) {
    if (typeof(jde) !== 'number') throw Error('Illegality Parameters.');

    // 先转化成世界时儒略日, 每天为86400秒
    let jd = jde - calc_ut_delay(jde);

    this.JD = jd;
    this.cache.JDE = jde;

    return this;
  }

  /**
   * 获取以 J2000 历元为起始的儒略历书日
   * 
   * @return {Number}      返回以 J2000 儒略历书日
   */
  get J2000() {
    // 2451545.0 代表历元 J2000.0 ，即2000年1月1日12:00
    return this.JDE - 2451545.0;
  }

  /**
   * 设置以 J2000 历元为起始的儒略历书日
   * 
   * @param {Number} j2000 需设置的 J2000 儒略历书日
   * @return {JDate}       返回 this 引用
   */
  set J2000(j2000) {
    if (typeof(j2000) !== 'number') throw Error('Illegality Parameters.');

    // 2451545.0 代表历元 J2000.0 ，即2000年1月1日12:00
    return this.JDE = j2000 + 2451545.0;
  }

  /**
   * 获取儒略世纪数
   * 
   * @return {Number}      返回儒略世纪数
   */
  get JDEC() {
    if (this.cache.JDEC === undefined) {
      // 36525 表示一百个儒略年的天数，即一儒略世纪
      this.cache.JDEC = this.J2000 / 36525;
    }

    return this.cache.JDEC;
  }

  /**
   * 设置儒略世纪数
   * 
   * @param {Number} jdec   需设置的儒略世纪数
   * @return {JDate}        返回 this 引用
   */
  set JDEC(jdec) {
    if (typeof(jdec) !== 'number') throw Error('Illegality Parameters.');

    // 36525 表示一百个儒略年的天数，即一儒略世纪
    this.J2000 = jdet * 36525;

    this.cache.JDEC = jdec;
    return this;
  }

  /**
   * 获取儒略千年数
   * 
   * @return {Number}       返回儒略千年数
   */
  get JDET() {
    if (this.cache.JDET === undefined) {
      // 365250 表示一千个儒略年的天数，即一儒略千年
      this.cache.JDET = this.J2000 / 365250;
    }

    return this.cache.JDET;
  }

  /**
   * 设置儒略千年数
   * 
   * @param {Number} jdet   需设置的儒略千年数
   * @return {JDate}        返回 this 引用
   */
  set JDET(jdet) {
    if (typeof(jdet) !== 'number') throw Error('Illegality Parameters.');

    // 365250 表示一千个儒略年的天数，即一儒略千年
    this.J2000 = jdet * 365250;

    this.cache.JDET = jdet;
    return this;
  }

  /**
   * 获取贝塞尔历元
   *
   * 根据 Lieske 提供的公式计算
   * 
   * @return {Number}       返回贝塞尔历元
   */
  get BEpoch() {
    if (this.cache.BEpoch === undefined) {
      this.cache.BEpoch = 1900.0 + (this.JD - 2415020.31352) / 365.242198781;
    }

    return this.cache.BEpoch;
  }

  /**
   * 设置贝塞尔历元
   *
   * @param  {Number} be    贝塞尔历元
   * @return {JDate}        返回 this 引用
   */
  set BEpoch(be) {
    if (typeof(be) !== 'number') throw Error('Illegality Parameters.');
    this.JD = (be - 1900.0) * 365.242198781 + 2415020.31352;
    this.cache.BEpoch = be;
    return this;
  }

  /**
   * 获取儒略历元
   *
   * @return {Number}       返回儒略历元
   */
  get JEpoch() {
    if (this.cache.JEpoch === undefined) {
      this.cache.JEpoch = this.J2000 / 365.25 + 2000.0;
    }

    return this.cache.JEpoch;
  }

  /**
   * 设置儒略历元
   * 
   * @param  {Number} je    儒略历元
   * @return {JDate}        返回 this 引用
   */
  set JEpoch(je) {
    if (typeof(je) !== 'number') throw Error('Illegality Parameters.');
    this.J2000 = (je - 2000.0) * 365.25;
    this.cache.JEpoch = je;
    return this;
  }
}

module.exports = JDate;
