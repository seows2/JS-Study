const arr1 = Array.from({ length: 3 }, (_, i) => i);
const arr2 = Array.from({ length: 3 }, () => Array(3).fill(0));
const arr3 = Array.from(arr1, (elm) => elm * 2);

console.log(arr1); // [ 0, 1, 2 ]
console.log(arr2); // [ [ 0, 0, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ]
console.log(arr3); // [ 0, 2, 4 ]
console.log(arr1);
const obj1 = {
  0: "zero",
  1: "one",
  2: "two",
  length: 3,
};

const arr4 = Array.from(obj1);
console.log(arr4);
