/**
 * @file 代理模式
 */

// 小明送花给A为例
class Flower {};

class XM {
  // 将花送给代理
  sendFlower(target) {
    const flower = new Flower();
    target.receiveFlower(flower);
  }
}

class A {
  receiveFlower(flower) {
    console.log('received flower', flower);
  }

  // 3秒后变为好心情
  listenGoodMood(fn) {
    setTimeout(() => {
      fn();
    }, 3000);
  }
}

// 代理者B 保护了A 称为保护代理
class B {

  instance_A = new A();

  // 代理监听A好心情 再送花
  receiveFlower(flower) {
    this.instance_A.listenGoodMood(() => {
      // 如果 new Flower() 开销很大也可以在这里new
      // flower = new Flower();
      this.instance_A.receiveFlower(flower);
    });
  }
}

const xiaoming = new XM();

xiaoming.sendFlower(new B());
