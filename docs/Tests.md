# 前端测试参考文档
## 概述
本文档描述前端项目测试的基本规范和详细注意事项与参考资料等。编写测试代码时，应注意遵循本文档中的规范；在编写测试遇到关于测试本身的技术问题时，可以先参考本文档中的资料；欢迎大家将测试过程中遇到的测试技术问题汇总到本文档中。

## 基本规范
* 与某代码文件`code.ts(x)`相关的单元测试代码应置于同文件夹下`code.aa.test.ts(x)`中。
* 端到端测试置于`src/tests/e2e.test.tsx`下。
* 端到端测试置于一个文件中的原因是考虑到分成多个文件的情况下文件命名等难以规范。但置于一个文件下时也代表需要遵循额外的合作开发规则。
    * 每个`describe`或`it`测试上方必须使用注释标明该测试的测试目的、代码简要思路以及测试作者。如：
    ```typescript
    /*
    * 测试funcA
    * 检查函数返回值是否符合文档定义
    * @author zcw
    */
    ```
    * 为表达方便，注释可使用中文。
    * 一般情况下，请勿直接修改他人测试代码。若认为他人测试代码存在问题，可通过issue等方式通知测试作者进行修改。
* 更新测试代码的commit message使用`tests: `分类。
## Mock规范
mock对象主要在两类测试中用到：单元测试与端到端测试。而这两类测试所需的数据或mock行为可能不一致。为了区分起见，我们规定供单元测试使用的mock对象以`test`前缀命名，如`testBaseService`；供端到端测试使用的mock对象以`mock`前缀命名，如`mockBaseService`。

单元测试用到的mock对象和数据可以直接放在相关的单元测试文件中，多个文件均需要使用的可以放在`mocks/testData.ts`下。

端到端测试用到的mock对象和数据与单元测试的规则类似，但共同数据应置于`mocks/mockData.ts`下。
    
## 参考资料
### 如何测试Axios Interceptors
https://github.com/axios/axios/issues/511#issuecomment-317403795

这个issue的思路其实基本上就是把interceptor函数提取出来然后测试而已，并没有拦截到实际axios调用interceptor时使用的config或response对象，但我们只需要测试interceptor的逻辑是否正确，所以进行适当的模拟输入即可。例如：
```typescript
let processedConfig=client.interceptors.request.handlers[0].fulfilled({headers: {}});
expect(processedConfig.headers['X-CSRFToken']).toBe('token');
```

### 如何测试React Hooks本身
注意：我们需要区分测试React Hooks本身与测试使用React Hooks的组件。后者与测试一般的组件并无区别。

测试React Hooks主要是对其返回值进行检查，以判断其返回值是否符合预先定义的要求；若Hooks还返回各种用于触发状态更新的函数，那么可在`act`中调用这些更新函数，然后再检查更新后的状态是否满足定义。

我们使用`@testing-library/react-hooks`来测试单个React Hook，具体参考：https://kentcdodds.com/blog/how-to-test-custom-react-hooks 。我们在此处列出一些注意事项。

`@testing-library/react-hooks`依赖库`react-test-renderer`，且要求其版本与所使用的React库版本一致，如若React版本为16.13.1，则前者版本也必须为`16.13.1`，如：
```shell script
yarn add react-test-renderer@16.13.1 --dev
```
因为此种版本要求无法在package.json内执行，因此我们必须手动安装合适的`react-test-renderer`依赖。

在最新的React库和Jest测试环境下，直接使用`DOM Testing Library`内的函数可能存在以下问题：
```
 TypeError: MutationObserver is not a constructor
```
这与Jest所提供的jsdom版本有关，参考此处解决：https://github.com/testing-library/dom-testing-library/issues/477#issuecomment-598606649

我们的useEntity等Hook还涉及到异步状态更新，为了测试异步代码，我们可以使用`DOM Testing Library`的`waitFor`函数(https://testing-library.com/docs/dom-testing-library/api-async#waitfor )，它的基本原理是在一定的`timeout`时限之内按照一定的`interval`不断运行给定的函数，直到函数不抛出异常或者超时，因此可以将Jest的expect置于被测试函数中，如下所示：
```typescript
import { useState, useEffect } from "react";

export function useTest() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  return loading;
}
---
import { renderHook } from "@testing-library/react-hooks";
import { useTest } from "./useTest";
import { waitFor } from "@testing-library/dom";

it("should update loading", async () => {
  const { result } = renderHook(() => useTest());
  expect(result.current).toBe(true);
  await waitFor(() => expect(result.current).toBe(false), {
    timeout: 2000
  });
});
```

React文档中指出，为了测试用户实际可能的交互情况，涉及状态更新的函数调用等应当置于`act`中，如：
```typescript
act(()=>{
  result.current.issueMutate(...)
})
```
但我们的useEntity Hook在第一次调用后即默认注册了一个`useEffect`事件，而它的状态更新是无论如何也无法直接封装到`act`块中的，因而会得到一个warning，但参考`act`的目的，这样的状态更新本来就是我们的代码实际运行中的更新方式，因此不必理会该warning，但后续的其他状态更新依然需要遵循该规定。
### 如何mock RESTful API
`axios-mock-adapter`只提供了基本的模拟服务端返回数据、延时等功能。对于返回的mock数据如何生成并未提供任何支持，这其实是不太合适的，因为若要完整地mock测试前端代码，就需要mock server与一个RESTful API有大致相似行为，而只使用`axios-mock-adapter`，等于要求开发者自行实现RESTful的CRUD逻辑，这是非常枯燥且不必要的。

我们可以尝试使用https://github.com/mswjs/msw 这个库进行mock，当然也可以直接在mock-adapter中开发简单逻辑。

### 如何mock测试Service的不同逻辑
不同的单元测试对mock的需求可能不同，如有的是测试Service是否能正常获取数据，有的是测试Service的错误处理逻辑，因此它们需要不同的mock响应。

BaseService构造函数接受一个client参数，允许用户代码传入不同的client供其使用。因此，对于不同的单元测试可以分别定义不同的client，随后分别传入，以测试不同的逻辑。如下：
```typescript
describe("Test normal flow of AuthService",async ()=>{
  let client=axios.create();
  let mock=new MockAdapter(client);
  mock.onPost('/auth/login').reply(200);
  let authService=new AuthService(client);
  // ...
});

describe("Test unexpected exception handling of AuthService",async ()=>{
  let client=axios.create();
  let mock=new MockAdapter(client);
  mock.onPost('/auth/login').reply(500);
  let authService=new AuthService(client);
  // ...
})
```
### 如何测试localStorage
`localStorage`属于浏览器API的一部分，在Node环境下并不可用，但我们可以转而使用该模块：https://github.com/clarkbw/jest-localstorage-mock 。它提供了一个`localStorage`的mock实现，且具有正常的功能。

经过一些讨论发现该mock模块的文档存在一些问题。文档中指出，为了避免不同的测试互相影响，应该使用`beforeEach`在每个测试执行前进行清理，这一思路本身是没有问题的，问题在于它建议的清理方式：
```typescript
beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  // or directly reset the storage
  localStorage.__STORE__ = {};
  // you could also reset all mocks, but this could impact your other mocks
  jest.resetAllMocks();
  // or individually reset a mock used
  localStorage.setItem.mockClear();
});
```
第一、二种都是仅仅清除对象中存储的数据，但这是不够的，因为对于一个mock模块，它的状态并不仅仅包含数据，更重要的是各个mock函数中存储的调用次数、调用信息等，这些也需要被清除，否则随后的`toHaveBeenCalledTimes`等断言则会失败。

文档中建议的第三种清除方式是不可行的。因为该mock模块提供的mock函数也具有正常的功能，换言之具有mock实现，并不是简单的调用情况统计。而在jest的文档中指出：
> jest.resetAllMocks()
  Resets the state of all mocks. Equivalent to calling .mockReset() on every mocked function.

进一步查看`mockReset`的文档：
> mockFn.mockReset()
  Does everything that mockFn.mockClear() does, and also **removes any mocked return values or implementations.**

因此使用`resetAllMocks`将会清除模块中提供的mock实现，随后任何与该模块功能有关的测试都会失败。

实际上，我们需要的是清除数据和使用统计信息，但并不清除mock实现，清除统计信息应该使用`jest.fn.mockClear`以及`jest.clearAllMocks`。因此完整清理代码如下：
```typescript
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem.mockClear();
  localStorage.getItem.mockClear();
});
```
不使用`clearAllMocks`是为了可能的其他mock模块的考虑。

另外WebStorm等的代码提示是基于正常浏览器/Node环境而非Jest测试环境，因此会提示不存在`mockClear`方法，忽略该提示或使用`// @ts-suppress`屏蔽即可。

### 如何点击组件进行测试

在测试 `点击` 效果的时候，我们使用 `fireEvent.click(screen.getByText(“Hello world”))` 来寻找内容为 `“Hello world”`的组件，但一个可能会遇到的问题是：

```
Unable to find an element with the text: Hello world.
This could be because the text is broken up by multiple elements.
In this case, you can provide a function for your text
matcher to make your matcher more flexible.
```

这是因为当text被包裹在深层的组件里时（如下图，“我的短连接”被包裹在 `<span></span>` 中），会出现寻找不到该组件的情况。而使用其他关键字来寻找是一件很麻烦的事。

<img src="https://i.loli.net/2020/07/22/jN9wvb6fuexGmzg.png" alt="image-20200722171349265" style="zoom:150%;" />

实际上，我们的 `screen.getByText` 不仅支持传递参数，也支持传递一个函数来作为`matcher`对组件进行删选，所以我们实现一个自定义的 `getByDeepText` 函数来寻找深层内容符合我们预期的组件

```javascript
function getByDeepText(text: string) {
    return screen.getByText((content: string, node: Element) => {
        const hasText = (node: Element) => node.textContent === text;
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every(
            (child: Element) => !hasText(child)
        );
        return nodeHasText && childrenDontHaveText;
    });
}
```

使用时直接调用 `fireEvent.click(getByDeepText('your text'))` 来执行组件的点击。


### 如何进行路由相关的交互测试

`react-router-dom`提供的各种`Router`的区别在于其底层绑定的`history`对象的类型不同，如`BrowserRouter`底层绑定的`history`对象是浏览器提供的API，用于测试的`MemoryRouter`底层绑定的对象是`MemoryHistory`。

该库提供的这些Router组件均只会去监听它们所绑定的history对象的变化，而在测试中，我们常常希望通过测试代码操控当前路由，这就要求我们能访问这些Router底层的history对象，但对于上述封装了创建`history`对象过程的组件，我们只有在组件中使用`useHistory`hook才能获取到它们所绑定的`history`对象，这是不太方便的。

在测试中，我们可以使用该库提供的`Router`基组件，它接受一个名为`history`的prop，值为要绑定的history对象。我们可以使用`history`库的`createMemoryHistory`函数创建一个`MemoryHistory`对象并绑定到`Router`组件上。为了和我们实现的声明式路由器组件区分，我们在导入库提供的`Router`组件时把它as为`BasicRouter`。
通过`history`对象也可以访问当前路由，`history.location.pathname`。

具体可以参考`Router.test.tsx`中的测试代码，例如：
```typescript jsx
const history = createMemoryHistory({
  initialEntries: ['/']
});
const {getByText} = render(<BasicRouter history={history}>
  <Router routes={routes}/>
</BasicRouter>);
expect(getByText(/1/i)).toBeInTheDocument();
act(() => {
  history.push('/t1');
});
expect(getByText(/2/i)).toBeInTheDocument();
act(() => {
  history.push('/t2');
});
expect(getByText(/3/i)).toBeInTheDocument();
```

### 如何利用wait和act去等待组件渲染

`waitForDomToBeChange` 函数已经被删除，如果想要简单的等待再次渲染，可以直接使用 `await waitFor(() => {})`来代替

act、wait怎么组合可以参考 [react-testing-library-and-the-not-wrapped-in-act-errors](https://medium.com/@davidwcai/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b)

### 如何在无法利用组件判断跳转完成时检测路由跳转

有时会出现无法判断跳转后页面渲染完成，从而不能确认何时检测路由的值的情况，我们可以通过 mock 一个 `history.replace()`函数，然后通过检查该函数如何被调用来实现对路由跳转的检测

通过参考这个实现 [mock useHistory](https://github.com/mrdulin/jest-codelab/blob/master/src/stackoverflow/58524183/NotFound.test.jsx)(虽然不能直接用但思路可以参考), 改写我们测试中可用的 mock 方法：

```tsx
const mockHistoryReplace = jest.fn();
const history = createMemoryHistory({
  initialEntries: ['/'],
});
history.replace = mockHistoryReplace;
const {getByPlaceholderText, getByText} = render(
    <BasicRouter history={history}>
      </>
    </BasicRouter>
)
```

接着检查:

```tsx
await waitFor(() => {
   expect(mockHistoryReplace).toHaveBeenCalledWith('/login');
});
```

### 如何测试需要等待的组件

有的时候我们会遇到在几秒之后自动展示/隐藏的组件（如 `Alert` ），尝试各种`waitFor`系列的函数和`expect`的组合都不能正确地等待到组件被渲染。使用最朴素的方法，等待几秒钟之后再去检查元素是否 `visiable`/ `not visiable`，sleep实现如下

```tsx
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

具体实现可以参考[what-is-the-javascript-version-of-sleep](https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep)

### 如何在不影响组件原有代码的情况下进行单元测试
对于组件的测试，我们的测试代码应该尽量追求不修改原组件代码，如此则使得单元测试存在一些困难，因为这些组件代码中不可能去专门使用为单元测试定义的`client`，而是要使用全局定义的普通`Service`。解决方案有两种，第一是将数据定义在`mockData`文件中，并将`globalE2EMock`配置项设为`true`。另一种方案如下：

```typescript
import {authService} from "./AuthService";

authService.client=testClient;
```

这一技巧利用了JavaScript中变量的引用本质。对于所有导入`authService`的模块，均相当于在自身作用域中创建一个引用，指向`AuthService.ts`中定义的全局对象。那么在这样的情况下，直接通过引用修改该对象的成员变量，将会让代码中其余使用该成员的代码也收到连带更新。但反之如果：
```typescript
authService=testAuthService;
```
则这仅仅只是将导入它的模块作用域内的一个引用指向他处，并不影响其他模块中使用该对象的代码。
