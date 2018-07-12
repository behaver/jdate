'use strict';

const JDate = require('./JDate.js');
const CacheSpaceOnJDate = require('./CacheSpaceOnJDate');

/**
 * JDateRepository
 *
 * JDateRepository 用于扩展储藏 JDate 组件计算的数值，便于获取并避免重复运算。
 * 天文算法中经常用到儒略世纪与儒略千年相关的指数计算，重复计算此类数值将消耗系统大量运算量，
 * 此处引入该组件则是为了避免这种情况的发生。
 * 
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.1
 * @license MIT
 */
class JDateRepository extends JDate {

  /**
   * 构造函数
   * 
   * @param {Mixed}  d     需构造的 日期对象 或 日期数值
   * @param {String} dtype 日期值的类型
   */
  constructor(d, dtype = 'jd') {
    super(d, dtype);

    this.csojd = new CacheSpaceOnJDate(this);
  }

  /**
   * 获取儒略世纪数乘幂值
   * 
   * @param  {Number} exp  乘幂次数
   * @return {Number}      计算结果
   */
  JDECP(exp = 1) {
    if (exp === 0) return 1;
    if (typeof(exp) !== 'number') throw Error('The param exp has to be a number.');
    let key = exp === 1 ? 'jdec' : 'jdec' + exp;
    
    if (!this.csojd.has(key)) { // 缓存中未存储该访问值
      let jdec = this.JDEC;
      this.csojd.set(key, Math.pow(jdec, exp));
    }

    return this.csojd.get(key);
  }

  /**
   * 获取儒略千年数乘幂值
   * 
   * @param  {Number} exp  乘幂次数
   * @return {Number}      计算结果
   */
  JDETP(exp = 1) {
    if (exp === 0) return 1;
    if (typeof(exp) !== 'number') throw Error('The param exp has to be a number.');
    let key = exp === 1 ? 'jdet' : 'jdet' + exp;

    if (!this.csojd.has(key)) { // 缓存中未存储该访问值
      let jdet = this.JDET;
      this.csojd[key] = Math.pow(jdet, exp);
    }

    return this.csojd[key];
  }
}

module.exports = JDateRepository;
