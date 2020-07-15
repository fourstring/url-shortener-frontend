# 前端项目基本开发规范
## TypeScript
对于项目中需要复用的各种类型，如来自后端API Server的返回数据、后端API Server所需求的数据、成员较多的组件的Props等数据类型，均需要创建对应的TypeScript类型定义。

在TypeScript中，一般我们使用Interface来创建类型定义。由于TypeScript转译到JavaScript执行，故Interface只是一种编译期的辅助检查，在运行时并不存在。如果你需要判断某个对象所属的Interface（如这个对象的类型是多个Interface的Union），那么你应该仔细考虑这样的参数设计是否合理，如果你认为这样的设计没有问题，那么你应该转而检查你需要的field在对象中是否存在，而非检查它的具体类型，如：
```typescript
export interface IDemo1 {
  a:number;
}

export interface IDemo2 {
  b:string;
}
export function processDemos(demo:IDemo1|IDemo2) {
  /* 以下代码是错误的，因为IDemo1/2在运行时并不存在
  if (demo instanceof IDemo1) {
    ...
  }
  */
  
  // 正确的做法是检查你需要的field是否存在
  if ('a' in demo) {
    // TypeScript编译器将可以推断demo类型为IDemo1
  } else if ('b' in demo) {
    // TypeScript编译器将可以推断demo类型为IDemo2
  }
  // 若demo的类型不是IDemo1或IDemo2，TypeScript于编译期即可发现类型不匹配错误，并终止编译
}
```
所有定义的接口均使用**IPascalCase**命名法，且应该被置于`src/types`文件夹下的某个`.ts`文件中，一项功能相关的多个Interface可以置于同一文件中。

## ESLint
我们使用Create React App默认的ESLint配置。但我们需要做的额外工作是配置你的IDE或Editor，使其能读取ESLint的输出，进而即时反馈在编辑界面上。

对于WebStorm，执行如下配置：
![WebStorm](https://i.loli.net/2020/07/15/RT5PpuDi73g4cWe.png)

## 命名规范
不同的对象遵循不同命名规范，大致如下：
* Class(e.g:Service): **PascalCase**
* Functional Component: **PascalCase**
* Variable/Function/Method: **camelCase**
* ReactHooks: **usePascalCase**
* Interface: **IPascalCase**
