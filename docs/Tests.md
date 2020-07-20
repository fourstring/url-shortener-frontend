# 前端测试参考文档
## 概述
本文档描述前端项目测试的基本规范和详细注意事项与参考资料等。编写测试代码时，应注意遵循本文档中的规范；在编写测试遇到关于测试本身的技术问题时，可以先参考本文档中的资料；欢迎大家将测试过程中遇到的测试技术问题汇总到本文档中。

## 基本规范
* 与某代码文件`code.ts(x)`相关的单元测试代码应置于同文件夹下`code.test.ts(x)`中。
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
