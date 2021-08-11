function Func() {}
Func.prototype.num = 2;
const a = new Func();
a.num = 1;
console.log(Func.prototype.num); // { num: 2 }
console.log(a); // Func { num: 1 }
console.log(a.num); // 1
