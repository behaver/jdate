# JDate 组件库

[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](#) [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/@behaver/jdate) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

## 简介

JDate 是一个相关天文算法之中 儒略时间 运算的组件库，它其中包含了 [JDate](/doc/JDate.md)、[JDateRepository](/doc/JDateRepository.md) 和 [CacheSpaceOnJDate](/doc/CacheSpaceOnJDate.md) 三个组件。此处只作组件库整体的简要说明，具体各组件的说明文档，请进入链接查看：

* [JDate](/doc/JDate.md) 儒略时间
* [JDateRepository](/doc/JDateRepository.md) 儒略时间扩展仓库
* [CacheSpaceOnJDate](/doc/CacheSpaceOnJDate.md) 依赖于儒略时间的缓存空间

## 安装

通过 npm 安装，在你的 node 项目目录下执行：

`npm install @behaver/jdate`

安装完成后，调用即可：

`const { JDate, JDateRepository, CacheSpaceOnJDate } = require('@behaver/jdate');`

## 用例

使用 JDate 组件库计算 儒略时间 以及应用依赖儒略时间的缓存空间：

```js
const { JDateRepository, CacheSpaceOnJDate } = require('@behaver/jdate');

let jdr = new JDateRepository(new Date('1992/8/15'), 'date');

// 输出给定时间的 JDE(儒略历书日) 数值
console.log('JDE: ' + jdr.JDE);

// 构建儒略时间缓存空间
let cache = new CacheSpaceOnJDate(jdr);

// 计算某一天文值
let l = 485868.249036 
	+ 1717915923.2178 * jdr.JDEC 
	+ 31.8792 * jdr.JDECP(2) 
	+ 0.051635 * jdr.JDECP(3) 
	- 0.00024470 * jdr.JDECP(4);

// 缓存数值
cache.set('l', l);

// 输出缓存
console.log(cache.get('l'));
```

## 类图

![JDate](./doc/img/JDate.png "JDate 组件库类图")

## 许可证书

The MIT license.