// 面向对象的单例模式
class Singleton {
	name;
	instance;

	constructor(name, instance) {
		this.name = name;
		this.instance = instance
	}

	getName() {
		return this.name;
	}

	static getInstance(name) {
		if (!this.instance) {
			this.instance = new Singleton(name);
		}
		return this.instance;
	}
}

// const a = Singleton.getInstance('sven1');
// const b = Singleton.getInstance('sven2');
// console.log(a === b);

// js用闭包实现通用的单例模式
const getSingle = function(fn) {
	let result;
	return function(...args) {
		return result || (result = fn.apply(this, args));
	}
}

const aFuntion = function() {
	// ...
};

const createSingleFunction = getSingle(aFuntion);
const a = createSingleFunction();
const b = createSingleFunction();

console.log(a === b);