# 声明式路由配置规范
## 概念
目前常用的React路由库`react-router-dom`的设计思路是将路由配置直接放在组件树中，例如：
```typescript jsx
<Switch>
  <Route path="/about">
    <About />
  </Route>
  <Route path="/users">
    <Users />
  </Route>
  <Route path="/">
    <Home />
  </Route>
</Switch>
```
这样做固然有简明易行的优点，但缺点其实是极为严重的。因为这种将路由信息放在组件树中的设计，同时也就让路由信息无法在其他地方被便捷地访问，而任何成熟的网站中这都是非常有必要的，例如，网页需要为用户展示一个顶栏，其中列出网站内的各种链接，便于用户导航；而在`react-router-dom`的这种设计下，顶栏组件无法便捷访问路由配置信息，从而只能选择硬编码链接，而这首先带来了不必要的信息冗余，其次为后续的维护带来了困难——如果还有其他地方也需要展示其他类型的导航呢？

路由信息置于组件树中的另一严重缺点是它没有为路由元信息（metadata）留下丝毫空间。通常情况下，我们可以在路由元信息中放置很多关于如何展示路由、路由权限配置等与UI交互有关的信息，如可以指示顶栏在展示该路由对应的链接时是否要附加图标、指示该路由是否仅登陆可见，顶栏在用户未登陆的情况下不应显示该路由对应的链接等等。综上，这种看似简单的设计极大地限制了路由信息本该有的作用。

事实上，Vue和Angular的路由库基本上采用的都是基于一份路由配置文件的路由模式，即在一份统一的配置文件中指定系统中的路由配置数组，其中的每个配置是由路由库定义的一个对象，包含了路径、对应的组件，以及作用极大的自定义元信息等数据；而路由库的工作就是根据配置文件的指令，生成对应的路由组件。

很容易发现，上面的工作实现起来其实并不难，关键在于根据需求准确定义路由配置文件的规范，然后只需少量代码即可实现根据配置文件生成路由组件的工作。

## 路由配置接口
我们定义下列接口作为路由配置的基础：
```typescript
export interface IRouteMetadata {
  displayText?: string;
  displayIcon?: React.ReactNode;
  anonymousOnly?: boolean;
  authenticatedOnly?: boolean;
  adminOnly?: boolean;
}

export interface IRoute {
  path: string;
  component?: React.ReactNode;
  subRoutes?: IRoute[];
  metadata?: IRouteMetadata;
}
```
`Route`接口表示单条路由配置信息，其中，`path`表示该路由所对应的路径，`component`为一个以JSX语法表示的React组件，路由器使用这两项信息生成实际的路由组件。`metadata`表示路由元信息，这些信息对于路由器没有实际的作用，而是便于其他需要路由信息的组件使用这些附加信息。我们定义的元信息分别与显示和权限有关。`displayText`指示顶栏或其他导航UI组件显示该路由对应的链接时的文字，如`首页`。`displayIcon`指示导航UI组件显示该路由对应的链接时是否应在文字前显示一个图标，它是一个图标组件。`anonymousOnly`指示该路由是否仅在用户未登陆时显示，如指向登录页面的路由在；`authenticatedOnly`指示该路由是否仅在用户登陆后显示，如指向登出页面的路由；`adminOnly`指示该路由是否仅在用户为管理员的情况下显示，如指向管理面板的路由。上述三项配置显然是互斥的，如果需要限制链接的展示情况，应当仅指定其中一项为`true`，其余项目可以忽略。若三项均未指定或均为false，则无条件展示该路由对应链接。一个示例配置如下：
```typescript jsx
const routes:IRoute[]=[
  {
    path:'/',
    component:<HomeView/>,
    metadata:{
      displayText:'首页',
      displayIcon:<HomeIcon/>
    }
  }
]
```
`subRoutes`配置与子路由有关，详见下文。
## 子路由
我们把如`/`、`/links`这样仅由一段路径组成的的路由称为顶级路由，将`/links/:id`这样的由多段路径组成的路由称为多级路由，而对于`/links`而言，`/links/:id`这一路由可以看作由`/links`加上`/:id`这两段路由组合而成，因而我们可以把`/:id`称为`/links`的子路由。

实现子路由最简单的方式就是在`/links`的路由配置之前再加上`/links/:id`的路由配置，但如果`/links`下还要有其他多个子路由呢？这样的情况下重复输入前缀`/links`不仅麻烦，而且也不直观。为了解决这一问题，我们在`Route`接口中引入`subRoutes`成员，它是一个数组，表示该路由下的子路由。根据前面的叙述，子路由的配置应当不需要反复输入前缀，而只需要输入子路由本身对应的路径段即可。

另外需要注意父路由如`/links`下可能也有需要渲染的组件，为了统一行为，我们将空路径也定义为`/links`下的一个子路径，需要在`/links`下渲染的组件使用`path`为空字符串的子路由表示。且该路由应置于子路由的最后一位。

在指定`subRoutes`的情况下，配置应不指定`components`，反之若指定`components`，则应指定`metadata`，但不应指定`subRoutes`。

例如下面的配置：
```typescript jsx
{
    path: '/links',
    subRoutes: [
      {
        path: '/:id',
        component: <LinkView/>,
        metadata: {
          displayText: '短链接',
          displayIcon: <LinkIcon/>
        },
      },
      {
        path: '',
        component: <LinksView/>,
        metadata: {
          displayText: '我的短链接',
          displayIcon: <LinkIcon/>
        }
      }
    ]
}
```
将会自动生成`/links`以及`/links/:id`两个路由配置。

## 路由器接口
我们所实现的路由配置文件是在`react-router-dom`提供的功能上的进一步封装和扩展，因此对于它提供的路由器组件我们也需进行扩展，以实现根据我们的路由配置文件自动生成路由组件的功能。

我们定义我们的路由器组件接口如下：
```typescript jsx
export interface IRouterProps {
  routes:IRoute[];
}
```
即只需传入路由配置数组，即可自动生成实际路由组件。

## 辅助函数
我们实现路由配置文件的另一目的是为了其他组件能便捷访问路由元数据，因此我们还实现一个辅助Hook用于达成这一目的，其接口如下：
```typescript
export function useRouteMetadata():IRouteMetadata {
  
}
```
此Hook将根据当前所在页面的完整路由，返回所对应的路由元信息对象，其内部将自动处理子路由等问题。

另外为了便于需要批量或自由访问路由元信息的需求，如渲染顶栏，还提供另一hook：
```typescript
export function useMetadataMap():Map<string,IRouteMetadata> {
  
}
```
此hook返回一个Map对象，其键为完整路由，值为该路由所对应的元信息。
