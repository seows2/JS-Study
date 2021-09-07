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

```js
import React from "react";
import ReactDOM from "react-dom";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";

// 애플리케이션 상태를 모델링합니다.
class Timer {
  secondsPassed = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increase() {
    this.secondsPassed += 1;
  }

  reset() {
    this.secondsPassed = 0;
  }
}

const myTimer = new Timer();

// observable state를 사용하는 사용자 인터페이스를 구축합니다.
const TimerView = observer(({ timer }) => (
  <button onClick={() => timer.reset()}>
    Seconds passed: {timer.secondsPassed}
  </button>
));

ReactDOM.render(<TimerView timer={myTimer} />, document.body);

// 매초마다 Seconds passed: X를 업데이트 합니다.
setInterval(() => {
  myTimer.increase();
}, 1000);
```

리액트 컴포넌트인 TimerView를 감싸고 있는 observer는 observable인 timer.secondsPassed에 의존하여 자동으로 렌더링 됩니다.

모든 이벤트(onClick, setInterval)는 observable state를 변경시키는 action을 호출합니다. observable state의 변경 사항은 모든 연산과 변경사항에 따라 달라지는 부수 효과(TimerView)에 전파됩니다.

![MobX](https://mobx.js.org/assets/flow2.png)

MobX는 어플리케이션에서 다음 세 가지 개념을 구분합니다.

- 상태(state)
- 동작(action)
- 파생(derivation)

<br>

1. 상태(state)를 정의하고 관찰 가능하게(observable) 만들기

원하는 데이터 구조의 state를 저장하고 MobX가 추적할 수 있도록 observable로 표시하면 됩니다.

```js
class todoStore {
  @observable
  todos = [];

  constructor() {
    makeObservable(this);
  }

  @action
  editTodoContent = (id, contents) => {
    const target = this.todos.find((todo) => todo.id === id);
    target[TODO_PROPERTY.CONTENTS] = contents;
  };

  @computed
  get activeTodoCount() {
    return this.todos.reduce((sum, todo) => sum + (todo.completed ? 0 : 1), 0);
  }
}

export default todoStore;
```

2. action을 이용한 state 업데이트

action은 사용자 이벤트, 백엔드 데이터 푸시, 예약된 이벤트 등과 같이 state를 변경하는 코드입니다.

위의 예시처럼 observable을 변경하는 코드는 action으로 표시하는 것이 좋습니다. 이렇게 하면 MobX가 트랜잭션을 자동으로 적용하여 성능을 쉽게 최적화할 수 있습니다.

action을 사용하면 코드를 구조화하는 데 도움을 줄 수 있으며 의도하지 않은 state 변경도 방지할 수 있습니다. state를 변경하는 메서드는 MobX 용어로 action이라고 합니다.

3. 상태(state) 변화에 자동으로 응답하는 파생(derivation) 만들기

state에서 더 이상의 상호작용 없이 파생될 수 있는 모든 것이 derivation 입니다. derivation은 다음과 같이 다양한 형태로 존재할 수 있습니다.

computed 값 : 현재의 observable state 에서 순수 함수를 사용하여 파생될 수 있는 값
reaction : state가 변경될 때 자동으로 발생해야 하는 부수효과

가장 좋은 방식은 현재 state를 기반으로 값을 생성하려는 경우에 항상 computed를 사용하는 것입니다.

MobX가 제공하는 대표적은 API는 `observable`, `action`, `observer`, `computed`가 있습니다.

- `observable`은 state를 저장하는 추적 가능한 필드를 정의합니다.
- `action`은 state를 수정하는 메서드를 표시합니다.
- `computed`는 state로부터 새로운 사실을 도출하고 그 결괏값을 캐시 하는 getter를 나타냅니다.
