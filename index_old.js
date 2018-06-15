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

    if (d != undefined) {    
        if (d.constructor === Date) {
            cacheData.date = d;
        } else if (typeof(d) === 'number') {
            this.setJD(d);
        }
    } else cacheData.date = new Date;
};

