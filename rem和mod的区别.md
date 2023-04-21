Remainder：取余；modulo：取模

Js中的%运算符使用的是rem的方式，rem方式使用Truncate除法。
不管是rem还是mod都满足：r = a - (a / b) x b
（其中a为被除数，b为除数，r为余数）

将rem改为mod: a - Math.floor(a/b)*b
ol为了兼容同号使用了: ((a % b) + b) % b
(n + b )/ b = 1 ······ n => (n + b) % b = n