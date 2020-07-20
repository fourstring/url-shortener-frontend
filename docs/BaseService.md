# BaseService规范
## Service概念
在一个前端项目中，对于网络的访问可以进行多层抽象，我们将抽象定义为三层：
* Level1: 由浏览器API（fetch）或请求库（Axios）所提供的直接发出原始HTTP请求的能力。它们封装了发出HTTP请求的底层细节，开发者的工作是将要请求的URL、数据、要设置的头部等内容传递给它们。
* Level2: 由本文档所定义的Service所提供的请求RESTful API的能力。RESTful规范建议了一套标准的访问HTTP API的方式，在这样的前提下，为了访问一个RESTful API，还去手工构造每一个HTTP请求是毫无意义的，可以使用Service来进行抽象。
* Level3: 由ReactHooks所提供的封装通过Service进行的数据获取和数据获取后常见的数据更新状态逻辑的能力。参考useEntity规范文档。

Service的抽象是与RESTful规范的定义密切相关的。具体来说，RESTful规范定义了一套标准的URL和请求方法结构，这就使得我们没有必要每个请求都去手动构造URL和选择合适的请求方法，而应该将这些请求方式封装为类的方法，提供统一规范的行为，开发者所需要做的就是提供方法所需要的数据和可能的GET参数配置。我们使用Service这一抽象来封装对于规范的RESTful API Endpoint的访问。一个Service类针对一个特定的endpoint进行请求。

从上面的叙述中我们可以看到，每个Service需要自定义的只是其所请求的Endpoint路径，而具体的请求方法中的URL格式、HTTP method只要是规范的RESTful endpoint均是一致的。所以我们可以抽象出BaseService基类，提供请求方法的实现，而子类继承BaseService，并定义该子类所请求的具体API endpoint。

## 接口
BaseService的接口如下：
```typescript
export interface IBaseService<T, InputT = T> {
  endpoint: string;
  client: AxiosInstance;

  constructor(client?:AxiosInstance);

  get(id: number): Promise<T>;
  
  getAll(filterOption?: IRequestFilterOptions<T>): Promise<IPagedData<T>>;

  post(data: InputT): Promise<T>;

  put(id: number, data: InputT): Promise<T>;

  patch(id: number, data: Partial<InputT>): Promise<T>;

  delete(id: number): Promise<boolean>;
}
```

由于Service涉及异步网络请求，故各个请求方法统一使用[`async/await`语法](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await) 。

## 接口行为规范
### 成员变量
* endpoint: 为该Service所要请求的RESTful API的路径，如：`links`，表示该Service针对`config.baseURL/links`下的各个接口发起请求。
* client: 该Service发起请求时所使用的Axios client。
### 错误处理
Service仅封装数据获取逻辑，所以我们将错误处理逻辑留到更高层的抽象（hooks）或调用层完成。当后端返回4xx/5xx状态码时，Axios会抛出AxiosError异常，可以捕获该异常进行处理。
### constructor(client?:AxiosInstance);
若传入`client`参数，则使用所传入的对象，否则使用全局定义的普通`client`。

如此设计主要是为了单元测试之便利，因为测试不同的代码所需的mock响应定义可能不同，因此使用一个全局的mockClient是一个灵活度较低的设计。此种设计下在不同的单元测试中可根据测试需求定义不同的mock client传入，更便于测试代码的组织。
### get(id: number): Promise\<T\>;
GET请求`config.baseURL/endpoint/${id}`，并返回后端所返回的数据。如：请求`http://localhost:8080/links/1` ,即表示获取id为1的Link数据。

使用[`urljoin`](https://github.com/jfromaniello/url-join#readme) 库来构造URL，而不要使用字符串拼接。

### getAll(filterOption?: IRequestFilterOptions\<T>): Promise\<IPagedData\<T>>;
GET请求`config.baseURL/endpoint`（以下不再赘述`config.baseURL`），该endpoint将提供服务端分页、过滤等功能，而该方法应返回包含分页信息的列表数据。如，请求`/links`，返回JSON如下：
```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "user": 1,
      "linkKey": "string",
      "href": "string",
      "createAt": "string",
      "updateAt": "string"
    }
  ]
}
```
返回JSON表示`/links`接口下第一页的数据，`count`表示所有数据条目，而非该页数据条目，该页的数据列表在`results`中。

对于这样的分页返回结果，我们额外定义分页数据接口：
```typescript
export interface IPagedData<T> {
  count:number;
  results:T[];
}
```

`GET /endpoint`这一接口允许客户端指定所请求数据的页数、每页的大小;另外提供服务端过滤功能，允许客户端指定所返回数据的筛选条件。这些功能均是通过提供特定的GET参数实现的，详见API规范文档。

`getAll`方法应当封装处理GET参数的行为，为此，我们额外定义`IRequestFilterOptions`接口，表示调用代码可以传入的一个对象，该对象指定了请求时所需的各种GET参数，并且对于一些有特定格式要求的GET参数，`IRequestFilterOptions`定义了对调用代码友好的表示方式，而格式转换逻辑在`getAll`方法内完成。`IRequestFilterOptions`定义如下：
```typescript
export interface IRequestFilterOptions<T> {
  page:number;
  size:number;
  fields:(keyof T)[];
  
  [name: string]:any;
}
```
其中，`fields`即是一种对调用代码友好的方式，因为后端需求的格式为`field1,field2,...,fieldn`，所以在`getAll`方法中应使用`fields.join(',')`进行转换。

调用代码还可以传入其他特定于某个endpoint的参数，但这样的参数应当能被axios所接受，亦即调用代码需要自行处理格式等问题。

### post(data: InputT): Promise\<T>;
POST请求`/endpoint`，添加新的数据条目，后端在完成添加后将会返回新的数据，方法应将其返回给调用代码。

对于更改服务端数据的方法，我们应当区分输入类型`InputT`与数据本身的类型`T`。因为后端创建一个新的数据条目时，并不需要客户端提供所有的信息，如`linkKey`这样的信息由后端逻辑产生，而不应由客户端提供。另一种情况涉及到关联数据。考虑`Link`，每个`Link`有一个创建者的关联数据，后端所返回的`Link`数据中有一个`user`成员提供了创建者的详细信息，这在获取数据时是有必要的。但在修改该`Link`时，这样的详细信息不是必要的，而且缺乏明确的语义。例如，如果要把一个`Link`的`user`从id为1的用户改为id为2的用户，那么在PATCH请求中还提供`user`的详细信息是没有任何必要的，而且倘若客户端提供的id为2的`user`的信息与数据库中已有信息不符，那么是否应该连带修改用户数据呢？这显然是很不明确且不恰当的，而且还会带来额外的网络传输开销。因此，对于关联数据，我们修改时仅提供新的关联对象的id即可，如此，输入类型`InputT`与数据类型`T`就产生了区别。例如：
```typescript
export interface ILinkInput {
  user:number;
}

export interface ILink {
  user:{
    id:number;
    username:string;
  }
}
```

虽然我们的后端并不提供已有`Link`数据的修改功能，但明确这一原则对于Web API的设计是非常有帮助的。

### put(id: number, data: InputT): Promise\<T>;
PUT请求`/endpoint/${id}`，使用`InputT`的数据完整替换该id的原有数据。

### patch(id: number, data: Partial\<InputT>): Promise\<T>;
PATCH请求`/endpoint/${id}`，使用`data`的数据部分替换该id的原有数据。因为是部分替换，所以所提供的数据也只需要是完整输入数据的一部分即可，我们使用TypeScript Partial辅助类型即可达到这一目的。

### delete(id: number): Promise\<boolean>;
DELETE请求`/endpoint/${id}`，请求删除id的原有数据。若服务端返回2xx，则返回true表示删除成功，否则引发异常。

## 参考实现
https://github.com/fourstring/bookstore_ts/blob/hal/src/services/BaseService.ts

该实现中有不少代码是为了适应Spring Data REST后端，并不适用于我们的后端。具体行为仍以本规范和API规范为准。
