# 组件使用规范

## `NavBar` 使用规范

```tsx
import {NavBar} from "../components/NavBar";
```

直接使用 `<NavBar/>` 即可

`NavBar` 会自动根据当前 `url` 来决定是否渲染顶栏，高亮哪个标签页；并根据用户是否登陆来确定是否渲染 `user menu`，以及部分渲染只是给已登录用户或者未登陆用户看的界面，具体 `menu.tsx` 属性的设置详见route

## `Alert` 使用规范

```tsx
import {Alert} from "../components/Alert";
```
并使用：

```tsx
<Alert 
    severity={"success"}  // alert 一些常用属性，可直接参考官方组件库的介绍
    action={<></>}
>
    your alert text    // 要展示的alert内容
</Alert>
```

