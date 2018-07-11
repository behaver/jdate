# JDateRepository

[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](#) [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/@behaver/angle) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

## 简介

JDateRepository 是在 [JDate](./JDate.md) 基础上的泛化组件，它额外提供了关于 *儒略世纪数* 和 *儒略千年数* 的幂乘运算功能，并对其运算结果实施缓存。开发者考虑到在大多数天文算法的运算中，都涉及到大量关于 *儒略世纪数* 和 *儒略千年数* 的幂乘计算，为了避免大量不必要的重复运算，我们有必要对原有的 [JDate](./JDate.md) 进行泛化扩展，从而解决之前所面临的问题。因 JDateRepository 是 [JDate](./JDate.md) 的子类，所以在 [CacheSpaceOnJDate](./CacheSpaceOnJDate.md) 的使用中，JDateRepository 实例仍然可以被当做 [JDate](./JDate.md) 实例进行依赖，实际上，在大多数情况中，我们更推荐这样使用。

## 用例

使用 JDateRepository 运算儒略时间：

```js
const { JDateRepository } = require('@behaver/jdate');

// 通过 JD 2446899 实例化一个 JDateRepository
let jdr = new JDateRepository(2446899);

// 输出 JDE(儒略历书日)
console.log(jdr.JDE);

// 输出 儒略世纪数 的四次方
console.log(jdr.JDECP(4));

// 输出 儒略千年数 的三次方
console.log(jdr.JDETP(3));
```

## API

`JDECP(exp = 1)`
获取 *儒略世纪数* 的乘幂值

`JDETP(exp = 1)`
获取 *儒略千年数* 的乘幂值

其余 API 详见于父类文档：[JDate](./JDate.md)

## 许可证书

The MIT license.

[返回首页](../readme.md)