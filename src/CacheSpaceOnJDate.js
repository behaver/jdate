'use strict';

const JDate = require('./JDate.js');

/**
 * CacheSpaceOnJDate
 * 
 * CacheSpaceOnJDate 用于创建基于 JDate 对象的同步缓存空间
 *
 * @author 董 三碗 <qianxing@yeah.net>
 * @version 1.0.0
 * @license MIT
 */
class CacheSpaceOnJDate {

  /**
   * 构造函数
   * 
   * @param  {JDate} jdate       参照的儒略时间对象
   */
  constructor(jdate) {
    this.on(jdate);
  }

  /**
   * 设定参照 JDate
   * 
   * @param  {JDate} jdate       参照的儒略时间对象
   * @return {CacheSpaceOnJDate} 返回 this 引用
   */
  on(jdate) {
    if (!(jdate instanceof JDate)) throw Error('The param jdate has to be a JDate.');
    this.jdate = jdate;
    this.JD = jdate.JD;
    this.cache = {};

    return this;
  }

  /**
   * 存入缓存变量
   * 
   * @param {String} key 变量名称
   * @param {String} val 变量值
   */
  set(key, val) {
    this.sync();
    this.cache[key] = val;
  }

  /**
   * 读取缓存变量
   * 
   * @param  {String} key 变量名称
   * @return {String}     缓存值
   */
  get(key) {
    this.sync();
    return this.cache[key];
  }

  /**
   * 判断缓存量是否存在
   * 
   * @param  {String} key 变量名称
   * @return {Boolean}    是否存在缓存
   */
  has(key) {
    this.sync();
    return this.cache[key] !== undefined;
  }

  /**
   * 清空缓存空间
   *
   * @return {CacheSpaceOnJDate} 返回 this 引用
   */
  clear() {
    this.sync();
    this.cache = {};
    return this;
  }

  /**
   * 同步缓存
   *
   * 如果 JDate 的时间发生变化，则清空当前缓存
   */
  sync() {
    let jd_cur = this.jdate.JD;
    if (this.JD !== jd_cur) {
      this.JD = jd_cur;
      this.cache = {};
    }
  }
}

module.exports = CacheSpaceOnJDate;
