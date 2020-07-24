# Config规范
我们使用一份配置文件来配置前端项目中一些共同参数。配置文件是一个`.ts`文件，其中包含一个对象，对象的每个成员代表一项设置参数，如下：
```typescript
export default {
  optionA: 'demo1',
  optionB: 'demo2'
}
```

配置文件路径为`src/config.ts`。
# 配置项
## baseURL
**string**

配置axios应当使用的baseURL，亦即后端的最高级URL，如`http://localhost:8080`，而具体某个endpoint具有如下格式：`http://localhost:8080/endpoint `。
## globalE2EMock
**boolean**

配置Service是否开启端到端mock测试模式，即默认使用为端到端mock测试准备的`globalE2EMockClient`以及mock数据。

## globalE2EMockClient
**AxiosInstance**

若`globalE2EMock`为true，则所有Service类在未提供`client`构造函数参数的情况下默认使用该mock client；否则在未提供`client`的情况下使用正常功能`client`（如生产构建、前后端联调等情况）。
