# React.js

React나 Vue같은 라이브러리의 가장 큰 특징은 유저 인터페이스를 **상태**로
관리할 수 있다는 점입니다.

브라우저는 DOM을 통해 웹 페이지를 렌더링 하는데 이 과정을 자바스크립트로 표현해보면,

```js
let data = "Hello World"; // (1)
const title = document.createElement("h1"); // (2)
document.body.appendChild(title); // (3)
title.textContent = data; // (4)
```

(1) 데이터를 준비한다.  
(2) 문자열을 출력할 엘리먼트를 생성한다.  
(3) 기존 문서에 추가한다.  
(4) 엘리먼트의 텍스트를 준비한 데이터로 설정한다.

만약 위 데이터를 수정하고 화면에 반영하려면 두 가지 작업이 필요합니다.

```js
data = "안녕하세요"; // (1)
title.textContent = data; // (2)
```

(1) 데이터를 수정한다.  
(2) 수정한 값을 엘리먼트에 반영한다.

위 방식을 조금 더 개선해서 data변수에 값을 변경하면 title 엘리먼트의 내용도 변경되도록 data변수와 title엘리먼트를 연결지어 보겠습니다. 그러면 data는 UI**상태**를 담는 역할이라고 할 수 있을겁니다.

<br>

## 리액티브

```js
const state = { _data: "Hello World" }; // (1)

const h1 = document.createElement("h1");
document.body.appemChild(h1);

const render = () => (h1.textContent = state.data); // (2)
```

전 코드와 달라진 점은 상태를 의미하는 state라는 이름의 객체를 만들어 그 안에 `data`키와 함께 `Hello World`를 넣어두었습니다.

(1) 이전의 data변수를 객체로 감쌌습니다.

엘리먼트에 상태값을 반영하는 `render()`함수를 만들었습니다.

(2)`render()` 함수로 state.data의 값을 엘리먼트에 반영할 수 있게 만들었습니다.

<br>

`Object.defineProperty()`함수를 이용해서 state에 data속성을 정의해보겠습니다.

```js
Object.defineProperty(state, "data", {
  get() {
    return state._data;
  },

  set(value) {
    state._data = value;
    render();
  },
});
```

```js
// 데이터를 가지는 상태 객체
const state = { _data: "Hello World" };

// 엘리먼트를 준비한다
const h1 = document.createElement("h1");
document.body.appendChild(h1);

// DOM에 변경된 내용을 반영하는 함수
const render = () => (h1.textContent = state.data);

// state.data 속성을 추가한다. 게터/세터를 만든다.
Object.defineProperty(state, "data", {
  get() {
    return state._data;
  },
  set(value) {
    state._data = value;
    render();
  },
});

// "Hello World" 가 출력된다.
render();

setTimeout(() => {
  // state.data 값을 변경하는 것만으로 "안녕하세요"가 화면에 출력된다.
  state.data = "안녕하세요";
}, 1000);
```

이전에는 데이터와 엘리먼트를 같이 변경하면서 화면을 제어했지만, 현재 코드는 데이터만 제어하면 자동으로 화면까지 반응합니다.

이렇게 특정 상태에 의존해 자동으로 반응하는 것을 **리액티브**하다고 표현합니다.

<br>

## 가상돔

가상돔 이야기

## JSX 등장
