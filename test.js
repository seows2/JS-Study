// 숫자 타입
const Strings = [
  0 + "", // "0"
  -0 + "", // "0"
  1 + "", // "1"
  -1 + "", // "-1"
  NaN + "", // "NaN"
  Infinity + "", // "Infinity"
  -Infinity + "", // "-Infinity"
  // 불리언 타입
  true + "", // "true"
  false + "", // "false"
  // null 타입
  null + "", // "null"
  // undefined 타입
  undefined + "", // "undefined"
  // 심볼 타입
  //Symbol() + "", // TypeError: Cannot convert a Symbol value to a string
  // 객체 타입
  {} + "", // "[object Object]"
  Math + "", // "[object Math]"
  [] + "", // ""
  [10, 20] + "", // "10,20"
  function () {} + "", // "function(){}"
  Array + "",
]; // "function Array() { [native code] }"

const Numbers = [
  // 문자열 타입
  +"", // 0
  +"0", // 0
  +"1", // 1
  +"string", // NaN
  // 불리언 타입
  +true, // 1
  +false, // 0
  // null 타입
  +null, // 0
  // undefined 타입
  +undefined, // NaN
  // 객체 타입
  +{}, // NaN
  +[], // 0
  +[10, 20], // NaN
  +function () {}, // NaN
];
console.log("--------------스트링타입--------------");
Strings.forEach((stinrg) => console.log(stinrg));
console.log("--------------넘버타입--------------");
Numbers.forEach((number) => console.log(number));

var x = 10;

// 암묵적 타입 변환
var str = x + "";
console.log(typeof str, str); // string 10

// 명시적 타입 변환
var str = String(x);

console.log(typeof str, str); // string 10

const str1 = "6";
const str2 = "2";
const num1 = str1 / str2;
const num2 = Number(str1) / Number(str2);
console.log(typeof num1, num1); // number 3
console.log(typeof num2, num2); // number 3
const age = Number("내 나이는 26살");
console.log(age);
console.log(Number("     123  ")); // 123
console.log(Number(" 133a")); // NaN
console.log(Number(true)); // 1
console.log(Number(false)); // 0
console.log(+null, "111111111111111111"); // 0
console.log(Number(undefined)); // NaN

console.log(Boolean(1)); // true
console.log(Boolean(0)); // false
console.log(!"티맥스"); // true
console.log(Boolean("0")); // false

var elem = null;

console.log(elem?.value); // null

var person = {
  "first-name": "우석",
  "last-name": "서",
  gender: "남자",
  1: 10,
};

console.log(person);

console.log(person["first-name"]); // '우석'

console.log(person.gender); // '남자'
console.log(person[gender]); // ReferenceError: gender is not defined
console.log(person["gender"]); // '남자'

console.log(person["1"]); // 10
console.log(person[1]); // 10 : person[1] -> person['1']
