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

flux라는 패턴을 발표했습니다. Model이 View를 반영하고, View가 Model을 변경하는 양방향 데이터 흐름에서 벗어나 **단방향으로만 데이터를 변경**할 수 있도록 만들었습니다.

1. View에서 데이터의 변경이 일어나면 Action을 생성한다.
2. Action이 생성되면 Watching하고 있던 Dispatcher에서 반응한다.
3. Dispatcher에서는 해당 Store가 해당 Action으로 등록한 Callback을 실행해준다.

<br>
<br>

## MobX

```js
// 애플리케이션 상태를 모델링합니다.
class Timer {
  @observable
  secondsPassed = 0;

  constructor() {
    makeObservable(this);
  }

  @action
  increase() {
    this.secondsPassed += 1;
  }

  @action
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

원하는 데이터를 저장합니다. 변경하려는 모든 속성을 MobX가 추적할 수 있도록 **`observable`** 로 표시하면 됩니다.

```js
class todoStore {
  @observable
  todos = [];

  constructor() {
    makeObservable(this);
  }

  @action
  removeTodo = (id) => {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  };

  @computed
  get activeTodoCount() {
    return this.todos.reduce((sum, todo) => sum + (todo.completed ? 0 : 1), 0);
  }
```

2. action을 이용한 state 업데이트  
   action은 사용자 이벤트, 백엔드 데이터 푸시, 예약된 이벤트 등과 같이 **state를 변경하는 코드** 조각입니다.

위의 예시처럼 observable을 변경하는 코드는 action으로 표시하는 것이 좋습니다. 이렇게 하면 MobX가 트랜잭션을 자동으로 적용하여 성능을 쉽게 최적화할 수 있습니다.

3. 상태(state) 변화에 자동으로 응답하는 파생(derivation) 만들기  
   state 변경 없이 파생될 수 있는 모든 것이 derivation 입니다.

computed 값 : 현재의 observable state 에서 순수 함수를 사용하여 파생될 수 있는 값
reaction: state가 변경될 때 자동으로 발생해야 하는 부수효과

<br>

## observable state 만들기

객체를 observable로 만드는 가장 기본적인 방법은 makeObservable를 사용하여 속성마다 주석을 지정하는 것

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

**makeAutoObservable** ??

<br>
<br>

## `observable`

observable 프로퍼티의 깊이를 정하는 deep, shallow, ref 등이 있다.

`observable.deep`

observable의 기본 동작 modifier. 모든 depth 를 observer 한다.
객체를 깊이 관찰 가능하게 만드는 데 추가 노력이 필요하지 않다.

```js
@observer
class Model extends Component {
  @observable
  user = {
    name: "myName",
    friends: [{ name: "firendName" }],
  };
  @action
  editUser = () => {
    //감지 => 렌더링
    this.user.friends[0].name = "newFriendName";
    //감지 => 렌더링
    this.user.friends.push({ name: "newFriendName" + i });
  };
}
```

`observable.ref`

object 자체가 아닌 객체의 참조만을 observable 하게 만듬

```js
@observable.ref
user = {
  name: "myName",
  friends: [{ name: "firendName" }]
};
@action
editUser() {
  // 참조가 유지 되기 떄문에 감지 되지 않는다
  this.user.friends[0].name = "newFriendName";
  // 참조가 변경 되서 감지 => 랜더링
  this.user = {...this.user}
};
```

| 주석                            | 설명                                                                                                                                                                                                                                                                                                             |
| ------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `observable`, `observable.deep` | state를 저장하는 추적 가능한 필드를 정의합니다. 가능한 경우 observable로 할당된 값은 해당 타입에 따라 자동으로 observable, autoAction 또는 flow로 변환됩니다. plain 객체, 배열, Map, Set, function, 제너레이터 함수(generator function)만 변환할 수 있으며, 클래스 인스턴스 및 그 외의 것들은 그대로 유지됩니다. |
| `observable.ref`                | observable과 유사하지만 재할당만 추적됩니다. 할당된 값들은 완전히 무시되며 절대 observable∙autoAction∙flow로 자동 전환되지 않습니다. 예를 들면 observable 필드에 변경 불가한 데이터를 저장하는 경우 사용하세요.                                                                                                  |
| `observable.shallow`            | observable.ref과 유사하지만 컬렉션을 위해 사용합니다. 할당된 컬렉션은 observable로 지정되나 컬렉션의 내용 자체는 observable로 지정되지 않습니다.                                                                                                                                                                 |
| `observable.struct`             | 현재 값과 구조상 똑같은 할당 값은 제외됩니다. 이 점을 제외하고는 observable과 유사합니다.                                                                                                                                                                                                                        |
| `action`                        | action은 state를 수정하는 메서드를 표시합니다. 더 자세한 내용은 actions를 확인하세요. 작성 불가(non-writable) 합니다.                                                                                                                                                                                            |
| `action.bound`                  | action과 유사하지만 추가적으로 this가 항상 설정되도록 action을 인스턴스에 바인딩 합니다. 작성 불가(non-writable) 합니다.                                                                                                                                                                                         |
| `computed`                      | 캐시 할 수 있는 파생 값으로 getter를 선언하는 데 사용할 수 있습니다. 더 자세한 내용은 computeds를 확인하세요.                                                                                                                                                                                                    |
| `computed.struct`               | 재계산된 결괏값이 이전 결괏값과 구조상 똑같은 경우 어떠한 observer에도 알리지 않습니다. 이 점을 제외하고는 computed와 유사합니다.                                                                                                                                                                                |
| `true`                          | 가장 나은 주석을 추론합니다. 더 자세한 내용은 makeAutoObservable을 확인하세요.                                                                                                                                                                                                                                   |
| `false`                         | 이 속성에 명시적으로 주석을 달지 마십시오.                                                                                                                                                                                                                                                                       |
| `flow`                          | 비동기 작업 관리를 위해 flow를 생성합니다. 더 자세한 내용은 flow를 확인하세요. TypeScript의 추론된 반환 유형(inferred return type)이 꺼져있을 수 있습니다. 작성 불가(non-writable) 합니다.                                                                                                                       |
| `flow.bound`                    | flow와 유사하지만 this가 항상 설정되도록 flow를 인스턴스에 바인딩 합니다. 작성 불가(non-writable) 합니다.                                                                                                                                                                                                        |
| `override`                      | 상속된 action, flow, computed, action.bound가 하위 클래스에 의해 재정의된 경우에 적용할 수 있습니다.                                                                                                                                                                                                             |
| `autoAction`                    | 명시적으로 사용되어서는 안되며, makeAutoObservable 환경에서 호출 컨텍스트(context)에 따라 action이나 derivation으로 작동할 수 있는 메서드를 표시하는 데 사용됩니다.                                                                                                                                              |

## `action`

모든 애플리케이션에는 action이 있습니다. action은 **state를 수정하는 코드** 조각
action 주석은 state를 수정하려는 함수에서만 사용해야 합니다.

## `computed`

computed 값을 사용하여 다른 observable 정보를 얻을 수 있습니다. computed 값은 느리게 평가하여 출력을 캐싱하고 observables 중 하나가 변경된 경우에만 다시 계산합니다.

```js
import { makeObservable, observable, computed, autorun } from "mobx";

class OrderLine {
  price = 0;
  amount = 1;

  constructor(price) {
    makeObservable(this, {
      price: observable,
      amount: observable,
      total: computed,
    });
    this.price = price;
  }

  get total() {
    console.log("Computing...");
    return this.price * this.amount;
  }
}

const order = new OrderLine(0);

const stop = autorun(() => {
  console.log("Total: " + order.total);
});

console.log(order.total);

order.amount = 5;

order.price = 2;

Computing...
Total: 0
Total: 0
Computing...
Computing...
Total: 10

```

## `reaction`

reaction의 목표는 자동으로 발생하는 부수효과를 모델링 하는 것

### `Autorun`

autorun 함수는 변화를 감지할 때마다 실행하는 함수 한 개를 수용하며, autorun 자체를 생성할 때도 한 번 실행됩니다. autorun은 observable 또는 computed로 주석 설정한 observable state의 변화에만 반응

```js
import { makeAutoObservable, autorun } from "mobx";

class Animal {
  name;
  energyLevel;

  constructor(name) {
    this.name = name;
    this.energyLevel = 100;
    makeAutoObservable(this);
  }

  reduceEnergy() {
    this.energyLevel -= 10;
  }

  get isHungry() {
    return this.energyLevel < 50;
  }
}

const giraffe = new Animal("Gary");

autorun(() => {
  console.log("Energy level:", giraffe.energyLevel);
});

autorun(() => {
  if (giraffe.isHungry) {
    console.log("Now I'm hungry!");
  } else {
    console.log("I'm not hungry!");
  }
});

console.log("Now let's change state!");
for (let i = 0; i < 10; i++) {
  giraffe.reduceEnergy();
}
```

```log
Energy level: 100
I'm not hungry!
Now let's change state!
Energy level: 90
Energy level: 80
Energy level: 70
Energy level: 60
Energy level: 50
Energy level: 40
Now I'm hungry!
Energy level: 30
Energy level: 20
Energy level: 10
Energy level: 0
```

위 코드의 처음 두 줄에 보이듯이, 두 개의 autorun 함수는 초기화될 때 한 번 실행됩니다. for 루프가 없어도 해당 두 줄은 보일 것입니다.

reduceEnergy action으로 energyLevel를 변경하기 위해 for 루프를 실행하면, autorun 함수가 observable state의 변화를 감지하는 '모든 순간' 새로운 로그를 출력합니다.

함수 "Energy level"의 측면에서 '모든 순간'이란 observable 속성을 가진 energyLevel이 변경되는 10회입니다.

함수 "Now I'm hungry"의 측면에서 '모든 순간'이란 computed 속성을 가진 isHungry가 변경되는 1회입니다.

<br>
<br>

## 항상 observer 컴포넌트 안에서 observable을 읽습니다.

일반적으로 observable 데이터를 읽는 모든 컴포넌트에 observer를 사용합니다.

observer는 감싸고 있는 컴포넌트만 개선하며, 감싸고 있는 컴포넌트를 호출하는 컴포넌트는 개선하지 않습니다. 따라서 일반적으로 모든 컴포넌트는 observer에 의해 감싸져야 하며, 모든 컴포넌트를 observer로 감싸는 행동은 비효율적이지 않기 때문에 걱정하실 필요가 없습니다. observer 컴포넌트가 많을수록 업데이트의 세밀성이 더 높아져 렌더링 효율성이 높아집니다.

## 데이터 스토어 정의

```js
class todoStore {
  @observable
  todos = [];

  constructor() {
    makeObservable(this);
  }
}

class viewStore {
  @observable todoFilter = FILTER.ALL;

  constructor() {
    makeObservable(this);
  }
}

class rootStore {
  constructor() {
    this.todoStore = new todoStore(this);
    this.viewStore = new viewStore(this);
  }
}
```

```js
const store = new rootStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider {...store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

```js
const todoApp = ({ todoStore, viewStore }) => {
  const { addTodo, activeTodoCount } = todoStore;
  const { todoFilter, changeTodoFilter } = viewStore;

  return (
    <div className="todoapp">
      <h1>TODOS</h1>
      <TodoInput addTodo={addTodo} />
      <main>
        <TodoItemList todoStore={todoStore} todoFilter={todoFilter} />
        <TodoFooter
          activeTodoCount={activeTodoCount}
          todoFilter={todoFilter}
          changeTodoFilter={changeTodoFilter}
        />
      </main>
    </div>
  );
};

export default inject("todoStore", "viewStore")(observer(todoApp));
```
