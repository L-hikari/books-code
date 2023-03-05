/**
 * @file 策略模式
 */
import PerformanceA from "./performances/PerformanceA.js";
import PerformanceB from "./performances/PerformanceB.js";

class Bonus {
  salary;
  strategy;

  setSalary(salary) {
    this.salary = salary;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  getBonus() {
    return this.strategy.calculate(this.salary);
  }

}

const bonus = new Bonus();

bonus.setSalary(10000);

bonus.setStrategy(new PerformanceA());

console.log(bonus.getBonus());

bonus.setStrategy(new PerformanceB);

console.log(bonus.getBonus());