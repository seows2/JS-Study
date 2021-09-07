# MobX

## 상태관리

리액트의 컴포넌트는 state를 통해 변경 가능한 데이터를 관리 할 수 있습니다.

```js
export default class DetailSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detail: [],
      loading: true,
    };
  }
}
```

사용자 유저 인터페이스는 다수의 컴포넌트를 통해 표현되며 각 컴포넌트가 상태를 관리할 경우 데이터 관리 및 제어가 어려워지고, 특정 데이터의 공유가 필요한 경우 이 데이터를 참조하거나 변경할 때 큰 어려움이 발생합니다.

<br>
<br>

## Flux 구조

![MVC](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FALrHe%2FbtqBTMSuHfN%2FZlW9i9ET34e90APgCRChk1%2Fimg.png)

MVC의 가장 큰 단점은 **양방향 데이터 흐름**

![flux](https://kkak10.gitbooks.io/flux/content/tumblr_inline_nq6jb2i3Z21skvdct_540.png)

flux라는 패턴을 만들었습니다. Model이 View를 반영하고, View가 Model을 변경하는 양방향 데이터 흐름에서 벗어나 단방향으로만 데이터를 변경할 수 있도록 만들었습니다.

1. View에서 데이터의 변경이 일어나면 Action을 생성한다.
2. Action이 생성되면 Watching하고 있던 Dispatcher에서 반응한다.
3. Dispatcher에서는 해당 Store가 해당 Action으로 등록한 Callback을 실행해준다.

<br>
<br>

## MobX

MobX가 제공하는 대표적은 API는 `observable`, `action`, `observer`, `computed`가 있습니다.

- `observable`은 state를 저장하는 추적 가능한 필드를 정의합니다.
- `action`은 state를 수정하는 메서드를 표시합니다.
- `computed`는 state로부터 새로운 사실을 도출하고 그 결괏값을 캐시 하는 getter를 나타냅니다.

```js
import { makeObservable, observable, computed, action, flow } from "mobx";

class Doubler {
  value;

  constructor(value) {
    makeObservable(this, {
      value: observable,
      double: computed,
      increment: action,
      fetch: flow,
    });
    this.value = value;
  }

  get double() {
    return this.value * 2;
  }

  increment() {
    this.value++;
  }

  *fetch() {
    const response = yield fetch("/api/value");
    this.value = response.json();
  }
}
```

리액트 컴포넌트인 TimerView를 감싸고 있는 observer는 observable인 timer.secondsPassed에 의존하여 자동으로 렌더링 됩니다.

모든 이벤트(onClick, setInterval)는 observable state를 변경시키는 action을 호출합니다. observable state의 변경 사항은 모든 연산과 변경사항에 따라 달라지는 부수 효과(TimerView)에 전파됩니다.

![MobX](https://mobx.js.org/assets/flow2.png)
