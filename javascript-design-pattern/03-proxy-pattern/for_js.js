/**
 * @file 代理模式
 * @description js代理操作和面向对象类似，这里示例用高阶函数创建动态代理
 */

/**************** 计算乘积 *****************/
var mult = function() {
  var a = 1;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i];
  }
  return a;
};
/**************** 计算加和 *****************/
var plus = function() {
  var a = 0;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a + arguments[i];
  }
  return a;
};

/**************** 创建缓存代理的工厂 *****************/
var createProxyFactory = function(fn) {
  var cache = {};
  return function(...args) {
    const arg_key = args.join(",");
    if (arg_key in cache) {
      return cache[arg_key];
    }
    return (cache[arg_key] = fn.apply(this, args));
  };
};
var proxyMult = createProxyFactory(mult),
  proxyPlus = createProxyFactory(plus);
console.log(proxyMult(1, 2, 3, 4)); // 输出：24
console.log(proxyMult(1, 2, 3, 4)); // 输出：24
console.log(proxyPlus(1, 2, 3, 4)); // 输出：10
console.log(proxyPlus(1, 2, 3, 4)); // 输出：10
