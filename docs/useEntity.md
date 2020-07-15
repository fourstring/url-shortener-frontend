# useEntity规范
## 概念
在BaseService的规范文档中，我们指出，仅仅封装数据获取的逻辑是不够的，还需要封装数据获取后的共性状态逻辑。我们知道，React的逻辑是`UI=f(state)`，若想让UI反映所获取的数据，就必须更新存储数据的state，而这样的更新逻辑是具有共性的。如：需要一个state用于指示数据是否还在加载中（`loading`），需要一个state存储数据本身（`data`），需要一个state指示数据获取过程中是否发生错误（`error`），需要一个方法来处理对所获取的数据进行变更的逻辑（`mutate`)，需要一个state来指示数据是否在变更中（`mutating`)。在传统的类组件中，要实现这些状态的复用是比较困难的，开发者将不得不在不同的类组件中重复这些逻辑，或使用灵活度很低的HOC等。ReactHooks提供了复用这些状态的方式。我们将封装根据id获取、更新单个数据对象的逻辑的Hooks命名为useEntity。

## 接口
TODO

## 状态逻辑
TODO

## 参考实现
https://github.com/fourstring/bookstore_ts/blob/hal/src/hooks/useEntity.ts
