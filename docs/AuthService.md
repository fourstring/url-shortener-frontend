# AuthService规范
## 概念
BaseService规范中提出的Service用于封装对规范RESTful API endpoint的访问，解决向RESTful API获取数据的需求。但在可以向API获取数据之前，我们需要先进行认证（Authentication）。而这一过程并非标准的RESTful endpoint，因而我们需要封装专门的AuthService类来处理相关的请求。

## 认证模式
对于RESTful API，常见的认证模式包括Token认证，Session认证，JWT认证。这几种方式各有优缺点，但也有一些共性。我们知道，HTTP协议是无状态的，而认证本身就是一种状态。所以要在HTTP协议中实现认证，我们就需要一种凭据在每个请求上进行传递。不同的认证模式区别主要与这一凭据的形式、传递方式、更新方式有关，但共同点在于首次认证都需要用户的用户名和密码，或者其他相等的方式来核实用户身份，然后签发认证凭据。

Token认证和Session认证本质上是相同的。它们的思想都是在使用用户名密码核实用户身份后，生成一个随机性强、难以碰撞的长字符串作为后续请求的凭据。若后续请求中带有这个凭据，则可以认为请求的发起者就是先前登陆的用户。它们的区别在于凭据的存储和传递方式。在Token认证下，客户端应当自行保存Token，在随后的请求中通过GET参数或如下Header：
```http request
GET /endpoint
Authorization: Token <token_value> 
```
来传递token。而Session认证方式是后端直接把SessionID作为Token，用户登陆后设置名为`SESSION`或其他类似名称的Cookie，随后的请求中由浏览器自动发送相应的Cookie。相较于Token认证，Session认证可以免去开发者管理token的麻烦，且绝大部分后端框架都有默认支持，实现简单，但问题在于Session认证是基于Cookie的，而在配置不当的服务器上这可能会留下[CSRF攻击漏洞](https://segmentfault.com/a/1190000016659945 )。

Token认证和Session认证的主要缺点在于不论是Token还是SessionID的信息量都很少，或者说它们与随机字符串没有本质上的区别，因而后端在验证一个token是否有效时就必须引入数据库，通过数据库来判断token是否有效、属于哪个用户。这么做的结果是这两种认证方式的扩展性（scale）都很差，因为在集群环境下频繁的数据库访问将给数据库带来很大的压力，而且存在单点故障的风险。那么解决方案是很自然的，就是增加token中的信息量，把用户认证所必须的数据，如用户id、用户名等也编码到token中，再通过校验/加密机制防止恶意签发和修改，这就是JWT的思想。限于篇幅原因，我们在此不赘述JWT的具体规范。

JWT认证传递token的方式与Token认证类似，也是通过特定的Header，如下所示：
```http request
GET /endpoint
Authorization: Bearer <jwt_value>
```

JWT认证的主要优势在于，由于Token中信息量大大增加，已经包含了后端中认证或者访问所需的用户数据，所以我们不再需要频繁查询数据库以获取用户信息，显著降低了数据库访问量，非常适合分布式环境。但JWT相较于Token或Session认证的主要缺点在于它无法有效地吊销。后者因为每次认证都需要查询数据库，那么只需要删除数据库中对应的条目，也就等价于token被吊销了，而JWT的出发点就是避免数据库访问，无法实现这样的吊销方式。一般情况下，JWT的唯一过期方式就是指定时间后到期，在没达到JWT中所规定的到期时间之前，哪怕用户已经登出，JWT依然有效。所以一个长期有效的JWT是非常危险的。

在分布式计算环境下，我们需要结合以上的几种认证方式来获得较好的扩展性与安全性。由于Session认证实现简单，我们采取Session认证+短期JWT定时刷新的认证方式。其流程如下：
* 首次认证：通过用户名和密码认证，服务端指示浏览器设置`SESSION` Cookie，并返回JWT`accessToken`与`csrfToken`。服务端返回的`accessToken`有效期为10分钟。客户端应部署定时检查并刷新JWT的逻辑。
* 后续认证：客户端首先检查`accessToken`是否即将或已经过期，若是，则首先GET请求`/auth/refresh`，该endpoint使用Session认证，成功则签发新的`accessToken`，否则说明session已过期或被注销，要求用户重新登录。刷新成功或`accessToken`未过期的情况下，使用`accessToken`发起实际请求。

## 接口
AuthService接口定义如下：
```typescript
export interface IAuthService {
  client: AxiosInstance;

  constructor(mock:boolean=false);

  login(cred: ILoginCredential): Promise<IUser>;

  logout();

  ping(): Promise<IUser|null>;

  register(profile: IRegisterCredential): Promise<boolean>;

  checkExists(username?: string,email?:string): Promise<boolean>;
  
  refresh(): Promise<boolean>;
}
```
凡返回类型为`Promise<T>`的方法均应使用async/await语法编写。

## 接口行为
### 成员变量
参考BaseService文档。
### constructor(mock:boolean=false);
参考BaseService文档。
### 错误处理
本类接口定义中某些方法应捕获AxiosError异常，某些方法不捕获异常。对于不捕获异常的方法，其异常由调用层处理。对于捕获异常的方法，应该检查该异常是否满足AxiosError接口（如检查[`isAxiosError`成员](https://github.com/axios/axios/pull/1419/files) ），而后再检查其状态码（`code`）是否为该API接口规范中已定义的可能错误返回，以上两个条件任一不满足，则重新抛出该异常（如后端返回500错误等），若二者均满足则执行行为定义中的错误处理操作。
### login(cred: ILoginCredential): Promise\<IUser>;
POST请求`/auth/login`接口，数据为用户名和密码。若用户名密码错误，axios将引发AxiosError异常，该异常由调用层处理。若用户名密码正确，后端将返回`User`，`accessToken`，`csrfToken`等一系列数据，该接口应当将`accessToken`与`csrfToken`存入LocalStorage中，以供Interceptor自动注入使用，详见Interceptor文档。随后，将`User`对象返回，作为方法的返回值。

### logout();
GET请求`/auth/logout`接口，随后不论接口返回值如何，将LocalStorage中的`accessToken`、`csrfToken`清除。

### ping(): Promise\<IUser|null>;
GET请求`/auth/ping`接口，该接口使用JWT认证，用于返回当前登陆用户的`User`数据。若接口成功返回，则将所返回的`User`数据作为返回值，若接口返回403,本方法应当捕获AxiosError，并返回null。

### register(profile: IRegisterCredential): Promise\<boolean>;
POST请求`/auth/register`接口，数据为用户名、密码、邮箱。若用户名或邮箱重复，那么接口返回400,方法捕获AxiosError并返回false表明注册失败；否则返回true表明注册成功。

### checkExists(username?: string,email?:string): Promise\<boolean>;
POST请求`/auth/exist`接口，数据为用户名和/或邮箱，若接口返回403,则捕获异常并返回false，表示数据有重复，否则返回true，表示数据无重复。

### refresh(): Promise\<boolean>;
GET请求`/auth/refresh`接口。若刷新成功，则更新LocalStorage中的`accessToken`为接口的返回值，并返回true表明刷新成功；否则捕获异常并返回false表明刷新失败，需要重新登录。
