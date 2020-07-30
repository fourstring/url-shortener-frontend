# Token规范
## 概念
为了适应集群环境下的用户认证需求，我们在`/links` API下均使用JWT认证。如AuthService文档所述，JWT认证的缺陷在于我们不能签发长时间有效的JWT，否则存在严重的安全隐患；因此，我们的JWT有效时间为10分钟。

JWT的详情可以参考[这篇文章](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html) 。总而言之，它是一个由头部、负载（数据）、校验签名三部分组成，以`.`分割的，且前两部分经过base64编码的字符串。我们的负载并无敏感信息，因此也未加密，在此种情况下，头部和负载在base64解码后均为合法的JSON。

jwt.io网站提供了在线JWT解码功能，我们使用的JWT解码前后分别如下所示。

解码前：
```jwt
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTk1OTg5NzI2LCJqdGkiOiI2MjMwZWYwNThjMzI0ZDIyYjhjMTBkOGU1OTYyMjJhOSIsInVzZXJfaWQiOjIsInVzZXJuYW1lIjoiZm91cnN0cmluZyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImFkbWluIjpmYWxzZX0.N8TiCeoI5-DHADugaywNGtAFuUjQ3hnzqRxFcxmsAFQ
```

解码后（仅节选负载部分）：
```json
{
  "token_type": "access",
  "exp": 1595989726,
  "jti": "6230ef058c324d22b8c10d8e596222a9",
  "user_id": 2,
  "username": "fourstring",
  "email": "test@example.com",
  "admin": false
}
```

需要关注的是`exp`,`user_id`,`username`,`email`,`admin`五项。其中，`exp`是一个UNIX时间戳，为该Token的过期时间，使用的时区为中国标准时间，即UTC+8. 剩余四项不难看出，除了`user_id`需要重命名为`id`外，均可以直接对应`IUser`中的信息。换言之，由于在`AuthService`中我们已经要求网页将`access_token`存储在`localStorage`中，所以只要可以读取`access_token`且其还未过期，即可认为用户已登陆，且已获取到用户相关信息。使用[`jsonwebtoken`库](https://github.com/auth0/node-jsonwebtoken#jwtdecodetoken--options) 即可读取jwt中的负载信息。

如前所述，JWT的有效时间很短，所以在使用JWT中的信息之余，还需要考虑如何定期刷新JWT以保证用户在未手动或Session过期登出前的访问体验。

## utils/jwtMonitor.ts
此文件用于存放与定时刷新逻辑相关的代码。其应导出一个全局变量与一个函数。

### jwtMonitor: (onFailed?:()=>void)=>Promise\<string>
`async`函数，每次调用时，首先检查`localStorage`中的`access_token`是否存在，若不存在说明用户未登陆，则直接返回空字符串。若存在，再检查其负载部分的`exp`与当前时间之差是否小于等于`jwtRefreshThreshold`（详见Config文档），若否，则直接返回现有`access_token`；若是，则调用`AuthService.refresh`方法刷新`access_token`并返回刷新后的`access_token`。

如果刷新失败，则说明用户已因超时登出或手动登出，此时该函数应将`localStorage`中的`access_token`删除。此外，若传入了`onFailed`函数，则调用该函数，我们可利用该回调函数来执行UI相关操作，如清空`UserContext`。最后返回空字符串。

### monitorId: number
`jwtMonitor`函数可手动调用，也可使用`setInterval`函数定时调用，在后一种情况下，`setInterval`将返回一个定时器id，可以使用`clearInterval`并向其传递该id来取消定时执行。

我们规定`monitorId`变量应被导出，且若定时执行`jwtMonitor`函数，则该变量中需要存储相应的定时器id，以便在适当的条件下取消定时执行。如用户手动登出后，则显然不再需要定时执行。

## App.tsx
有了`access_token`中的信息，我们可以简化`App.tsx`中初始化`UserContext`的逻辑。目前的实现是调用`AuthService.ping`来拉取当前登陆用户的信息，但这些信息其实已经包含在`access_token`中了。因此我们定义如下的初始化逻辑：

1. 在`useEffect`中直接调用`jwtMonitor`，并解析其返回值，将负载部分的用户数据放到`UserContext`中。若返回值为空字符串则不执行任何操作。
2. 若上述调用成功（即不返回空字符串），则使用`setInterval`，以`jwtMonitorRate`配置项指定的频率调用`jwtMonitor`函数，并设置`monitorId`。注意调用该函数返回一个Promise，Promise将会被自动加入事件循环，无需`await`或`then`。传入的`onFailed`函数应执行两项行为：清除`UserContext`，以及取消定时执行。

可以看出，`jwtMonitor`函数的返回值主要就是为了`App.tsx`的第一次调用准备的，后续返回值可以忽略，因为若用户保持登陆，则负载中用户相关数据并不会变化；若用户已经登出，则`onFailed`函数将会清除`UserContext`与定时执行，亦不再需要关注返回值。

## AuthService.logout
该方法还应检查`monitorId`，并使用`clearInterval`取消定时执行。

## 测试指南
参考Tests文档中“如何在不影响组件原有代码的情况下进行单元测试“一节。
