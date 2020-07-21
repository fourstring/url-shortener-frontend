# useEntity规范
## 概念
在BaseService的规范文档中，我们指出，仅仅封装数据获取的逻辑是不够的，还需要封装数据获取后的共性状态逻辑。我们知道，React的逻辑是`UI=f(state)`，若想让UI反映所获取的数据，就必须更新存储数据的state，而这样的更新逻辑是具有共性的。如：需要一个state用于指示数据是否还在加载中（`loading`），需要一个state存储数据本身（`data`），需要一个state指示数据获取过程中是否发生错误（`error`），需要一个方法来处理对所获取的数据进行变更的逻辑（`mutate`)，需要一个state来指示数据是否在变更中（`mutating`)。在传统的类组件中，要实现这些状态的复用是比较困难的，开发者将不得不在不同的类组件中重复这些逻辑，或使用灵活度很低的HOC等。ReactHooks提供了复用这些状态的方式。我们将封装根据id获取、更新单个数据对象的逻辑的Hooks命名为useEntity。

注意：useEntity封装的是根据id获取数据-更新数据的完整逻辑，若只需要新增数据/删除数据等情况，应当转而使用`Service`抽象。

## 接口
### 状态定义
useEntity内部定义了如下状态：
```typescript
export interface useEntityState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError<T> | null;
  mutating: boolean;
}
```
其中，`data`表示通过GET请求如`/endpoint/${id}`这样的RESTful单一资源URL返回的数据，类型为参数`T`。`loading`指示数据是否仍在获取中，当`loading`为`true`时，表明页面或组件还在首次拉取数据，数据暂不可用，因此可为用户展示加载画面。`error`指示上一次数据获取或变更过程中是否出错，如出错，则存储异常对象，否则为null；`mutating`指示数据是否仍在变更中，区分`mutating`和`loading`是有必要的，因为`mutating`是先前数据已经展示给用户，而用户做出更改数据操作后，表明更改正在发生中的状态，而`loading`是表明页面首次加载，还未有任何数据的状态；有了`mutating`的指示，UI可以不必展示加载画面，而是暂时展示原先数据，等待变更完成后再给用户反馈新的数据。
### 返回值定义
```typescript
export interface MutateInput<T, InputT> {
  id?: number;
  data?: T | Partial<InputT>;
  method?: MutateMethods;
  mutator?: (dispatch: Dispatch<EntityStateAction<T>>) => Promise<void>;
}

export interface useEntityResult<T, InputT> extends useEntityState<T> {
  issueMutate: (input: MutateInput<T, InputT>) => void; // useMutate just set states in useEntity.
}
```
useEntity将返回内部定义的所有状态，暴露给用户代码，除此之外还返回`issueMutate`函数，用于处理对该hook调用时所传入的`id`的资源的状态变更（mutation）请求。

## 状态逻辑
### Reducer
不难发现，上述定义的几个状态量并不是孤立的，在正常的逻辑设计下，它们应该是联动的。例如，当数据成功请求时，应该将`data`设为`Service`返回的数据、`loading`设为false，`error`设为null。下面的代码是不可行的：
```typescript
const [data,setData]=useState({});
const [loading,setLoading]=useState(true);
const [error,setError]=useState(null);

...
setData(...);
setLoading(false);
setError(null);
```
因为每次调用`useState`返回的`setState`函数，都将造成React执行一次重绘，也就意味着执行原组件的所有逻辑，在这样的情况下，轻则浪费CPU、带来不必要的渲染；重则因为使用该hook的组件的具体逻辑带来严重的错误。解决方案是很直观的，既然在需要联动的情况下，多个分立状态量不可行，那么我们可以定义一个统一的状态对象，将这些状态量作为它的成员变量，然后一次更新这些成员变量就能实现状态的联动了。

React提供了[`useReducer` hook](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer) 来帮助开发者管理复杂状态及其更新逻辑。我们在此不涉及具体代码，只简单介绍useReducer的思想。它的思路与上述统一状态对象的方案完全相同。只不过对于`useState`返回的`setState`函数，它并不支持增量更新状态，而只能全量更新状态，所以当状态对象过于复杂的情况下，每次还使用`setState`就会非常麻烦。此外，因为状态对象中的成员需要联动，那么更新逻辑势必较为复杂，将这些逻辑分散在hook中，会导致代码可读性降低、测试困难、代码冗长等问题。因此，`useReducer`在统一状态对象的方案上更进一步，采取基于预先定义事件的状态更新模型。具体而言，使用`useReducer`需要先定义状态对象，然后定义所谓的`Reducer`，它是一个函数，接受前一状态的状态对象`state`、以及具体的状态更新事件`action`作为输入，返回新的状态对象。

`useReducer`并没有对`action`的结构作出任何规定，其结构以及语义可以完全由开发者自行决定，但一般情况下我们均至少使用TypeScript枚举类型定义`action.type`以表明状态更新事件的类型，而后在`Reducer`中使用类似`swtich`的语句根据不同的状态更新事件执行不同的状态更新逻辑；当然，不同的状态更新事件可能需要不同的数据，这些都可以由开发者在`action`对象中自行定义，只要`Reducer`中进行相应的处理即可。

`Reducer`通过接受预先定义的事件、执行固定的预先定义的状态更新逻辑来更新状态对象，它的一大优势是有助于开发者设计出状态更明确的hook，因为它要求开发者在定义状态时还要预先定义各种可能的状态更新逻辑，这有助于开发者理清状态设计的思路；另一优势是显著提升了代码可读性：维护者只需要阅读`Reducer`代码即可了解完整的状态更新逻辑，而不再需要在整个hook的代码中四处跳转。`Reducer`的第三大优势是它对单元测试极为友好，因为所有的状态更新逻辑都被统一到`Reducer`中，在单元测试时可以单独针对`Reducer`编写测试，从而测试设计的状态更新逻辑是否正确，反之若将状态更新逻辑分散到hook的代码中，那么在状态复杂的情况下单元测试将是一个艰巨的任务。

### Action
```typescript
export enum EntityStateActionType {
  SET_DATA,
  CLEAR_DATA,
  LOADING,
  MUTATING,
  ERROR,
}

export interface EntityStateAction<T> {
  type: EntityStateActionType;
  data?: T | null;
  error?: AxiosError<T> | null;
}
```
本Hook中所使用的`Reducer`接受的`Action`定义如上所示。不同`ActionType`的语义如下所述。
#### SET_DATA
用于请求成功后的回调，此事件应将`data`设为请求的返回数据、`error`设为null，`loading`设为false。因此在此事件下，`action`中还应提供`data`。

#### CLEAR_DATA
用于清除已有数据，将`data`设为`null`，`error`设为null，`loading`设为false。

#### LOADING
用于初次执行获取数据前表明数据正在加载，将`loading`设为`true`。

#### MUTATING
用于表示变更正在进行中，将`mutating`设为`true`。

#### ERROR
用于表示请求或其他相关逻辑抛出了异常或产生错误，将`error`设为捕获的异常对象，需要在`action`中提供`error`。

### Mutation
我们应该区分Mutation与Action的概念。`Reducer`只是给我们提供了最终更新状态的工具，但要更新状态，我们首先就需要有一个新的目标状态，例如更新后的数据。`Reducer`与`Action`只是将新的数据转化为新的状态，但新的数据的产生、处理等逻辑当然仍需要开发者自行考虑，这就是Mutation的概念。Mutation表示对后端数据的变更操作，如RESTful规范中所建议的基于`PUT`或`PATCH`等方法对后端数据进行变更，此种情况的逻辑我们是可以进行复用、标准化的，称为标准mutation;但另外在RESTful的基础上我们可能还会定义一些自定义URL结构进行自定义的数据变更，如`/books/1/update_cover`表示更新`id`为1的书籍的封面图片，这样的URL可能并不接受JSON数据、其返回值也可能不是更新后的数据，因此并非RESTful规范中所定义的情况，属于自定义的数据变更。

为了Mutation的灵活性，我们返回的`issueMutate`函数应该同时支持上述两种变更方式。对于标准的变更，我们的`Service`已经完成了对标准RESTful API的访问抽象，所以可以直接调用传入service的相应方法来完成；对于自定义变更，它通常需要用户代码自定义逻辑，所以我们要求用户传入一个执行变更的`async`函数`mutator`，`mutator`的逻辑由调用者自行定义，可以执行各种用户自定义的请求，但我们注意到，不论请求如何，最终都要落实到状态的更新，因此我们可以将`Reducer`的`dispatch`函数传递给`mutator`，由`mutator`根据自身的具体逻辑，执行相应的状态更新。

根据上面的阐述，我们可以定义如下的`issueMutate`相关类型：
```typescript
export enum MutateMethods {
  POST,
  PUT,
  PATCH,
  DELETE
}

export interface MutateInput<T, InputT> {
  id?: number;
  data?: T | Partial<InputT>;
  method?: MutateMethods;
  mutator?: (dispatch: Dispatch<EntityStateAction<T>>) => Promise<void>;
}
```
其中，`MutateMethod`定义了几种RESTful规范下的标准变更方式。通常，RESTful后端在接受这些变更请求后，响应即是变更后的完整数据，便于前端直接展示新的数据;因此，对于标准变更方式，我们只需要通过service发起对应的请求，传入`data`，随后将service的返回数据执行`SET_DATA`事件即可。当然，如果请求出错，则执行`ERROR`事件。

`issueMutate`函数首先disptach`MUTATING`事件，以表明变更正在进行；随后若`mutator`已定义，则直接调用`mutator`并结束执行；否则执行标准变更逻辑。

### Deep Comparison
React中默认对于“相等”这一概念的判定采用的是`Object.is`算法，但很多情况下这可能会产生一些问题。最常见的情况是由于JavaScript的对象是轻量级的，所以传入hook的参数可能是对象字面量，那么这种情况下，每次传入对象的内存地址是不同的，而`Object.is`执行的是基于内存地址的比较，因而它将认为前后两个对象不等，即使它们的成员内容一致。前者称为浅比较（Shallow Comparison），而后者称为深比较（Deep Comparison）。很多场合下浅比较就已经足够，但在需要深比较的场合，浅比较将会带来逻辑问题。

一个典型情况是由于JavaScript中对象的传递方式类似于引用传参，所以`Reducer`的`state`参数是对原状态对象的一个引用；如果在`Reduer`中直接更新`state`的成员，而后返回`state`，React将会基于`Object.is`认为状态对象没有更新（因为并没有创建新的状态对象），从而也不触发重绘。所以在`Reducer`中必须：
```typescript
let newState={...state};
...
return newState;
```
另外也要注意，上述复制state对象的方法是浅复制，即若`state`对象中还包含引用对象，那么复制的是引用，而不是被引用的对象，需要留意浅复制可能带来的问题。

另一个典型情况是对于`filterOption`的处理。典型的使用该参数的调用代码如下：
```typescript
const {data,loading,error}=useEntity(id,service,{
  page:1,
  size:10
});
```
可以看到，这里对`filterOption`传入的是一个对象字面量，那么这就意味着每次重绘时，传入hook的都是一个全新的对象，哪怕它的内容与上一次重绘时相比并没有发生变化。在这样的情况下，仅仅在hook的`useEffect`中将`filterOptio`列为依赖是不够的，因为这也是基于浅比较的；而此时我们需要的是与上一次调用时的参数值进行深比较。

`lodash`库的`isEqual`对于JavaScript中的多种对象均提供了基于比对内容的深比较算法，可以使用它来进行深比较。但首先我们还需要能访问上一次hook被调用时的参数，React文档中提出的[`usePrevious`](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state) 可以完成这一目的。

## 参考实现
https://github.com/fourstring/bookstore_ts/blob/hal/src/hooks/useEntity.ts
