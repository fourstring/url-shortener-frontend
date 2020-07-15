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
## globalMock
**boolean**

配置Service是否应默认使用经过`axios-mock-adapter`处理的mock client，而非使用普通axios client，以便于测试等目的。
