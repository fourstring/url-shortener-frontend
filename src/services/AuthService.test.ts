<<<<<<< HEAD
import {AuthService} from './AuthService';
import '@testing-library/jest-dom'
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import 'jest-localstorage-mock';
import  {userDb} from "../mocks/mockDb"

beforeEach(() => {
    localStorage.clear();
    localStorage.setItem.mockClear();
    localStorage.getItem.mockClear();
});

/*
* 测试AuthService.login
* 检查login是否符合文档定义
* @author lzl
*/
describe('AuthService login test',() => {
    const request = {username: 'test1', password: ''};
    /*
    * 测试正确情况AuthService.login
    * 检查login是否正确返回
    * @author lzl
    */
    it("Test normal flow",async ()=>{
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onPost('/auth/login').reply(() => {
            return [200, {user: userDb.get(1), accessToken: "test", csrfToken: "test"}]
        });
        let authService = new AuthService(client);
        await expect(authService.login(request)).resolves.toEqual(userDb.get(1));
        expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    });

    /*
    * 测试失败情况AuthService.login
    * 检查login在密码错误时是否正确抛出错误
    * @author lzl
    */
    it('Test fail flow', async () => {
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onPost('/auth/login').reply(() => {return [403]});
        let authService = new AuthService(client);
        await expect(authService.login(request)).rejects.toThrow();
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });

    /*
    * 测试失异常情况AuthService.login
    * 检查login在异常时是否抛出错误
    * @author lzl
    */
    it('Test error flow', async () => {
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onPost('/auth/login').reply(() => {
            return [500]
        });
        let authService = new AuthService(client);
        await expect(authService.login(request)).rejects.toThrow();
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    })
});

/*
* 测试AuthService.logout
* 检查logout是否符合文档定义
* @author lzl
*/
describe('AuthService logout test',() => {
    /*
    * 测试AuthService.logout成功
    * logout检查localStorage被移除两次
    * @author lzl
    */
    it("Test normal flow",async ()=>{
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onGet('/auth/logout').reply(() => {
            return [200]
        });
        let authService = new AuthService(client);
        await authService.logout();
        expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
    });
});

/*
* 测试AuthService.ping
* 检查ping是否符合文档定义
* @author lzl
*/
describe('AuthService ping test',() => {
    /*
    * 测试AuthService.ping成功时返回值
    * 检查ping成功时返回200
    * @author lzl
    */
    it("Test normal flow",async ()=>{
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onGet('/auth/ping').reply(() => {return [200, userDb.get(1)]});
        let authService = new AuthService(client);
        await expect(authService.ping()).resolves.toEqual(userDb.get(1));
    });

    /*
    * 测试AuthService.ping失败时返回值
    * 检查ping失败时返回403
    * @author lzl
    */
    it('Test fail flow', async () => {
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onGet('/auth/ping').reply(() => {return [403]});
        let authService = new AuthService(client);
        await expect(authService.ping()).resolves.toEqual(null);
    });

    /*
    * 测试AuthService.ping异常时返回值
    * 检查ping异常时抛出错误
    * @author lzl
    */
    it('Test error flow', async () => {
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onGet('/auth/ping').reply(() => {return [500]});
        let authService = new AuthService(client);
        await expect(authService.ping()).rejects.toThrow();
    })
});

/*
* 测试AuthService.register
* 检查register是否符合文档定义
* @author lzl
*/
describe('AuthService register test',() => {
    const profile = {
        username: 'test',
        password: 'test',
        email: 'test'
    };
    /*
    * 测试AuthService.register成功返回值
    * 检查register是否成功返回true
    * @author lzl
    */
    it("Test normal flow",async ()=>{
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onPost('/auth/register').reply(() => {return [200]});
        let authService = new AuthService(client);
        await expect(authService.register(profile)).resolves.toEqual(true);
    });

    /*
    * 测试AuthService.register失败时的返回值
    * 检查register是否成功返回false
    * @author lzl
    */
    it('Test fail flow', async () => {
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onPost('/auth/register').reply(() => {return [400]});
        let authService = new AuthService(client);
        await expect(authService.register(profile)).resolves.toEqual(false);
    });

    /*
    * 测试AuthService.register异常时的返回值
    * 检查register直接抛出
    * @author lzl
    */
    it('Test error flow', async () => {
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onPost('/auth/register').reply(() => {return [500]});
        let authService = new AuthService(client);
        await expect(authService.register(profile)).rejects.toThrow();
    })
});

/*
* 测试AuthService.refresh
* 检查refresh是否符合文档定义
* @author lzl
*/
describe('AuthService refresh test',() => {
    const result = {"accessToken": "test"};
    /*
    * 测试AuthService.refresh成功返回值
    * 检查refresh是否成功返回true
    * @author lzl
    */
    it("Test normal flow",async ()=>{
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onGet('/auth/refresh').reply(() => {return [200, result]});
        let authService = new AuthService(client);
        await expect(authService.refresh()).resolves.toEqual(true);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });

    /*
    * 测试AuthService.refresh失败时的返回值
    * 检查refresh是否失败返回false
    * @author lzl
    */
    it('Test fail flow', async () => {
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onGet('/auth/refresh').reply(() => {return [403]});
        let authService = new AuthService(client);
        await expect(authService.refresh()).resolves.toEqual(false);
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });

    /*
    * 测试AuthService.refresh异常时的返回值
    * 检查refresh是否异常抛出错误
    * @author lzl
    */
    it('Test error flow', async () => {
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onGet('/auth/refresh').reply(() => {return [500]});
        let authService = new AuthService(client);
        await expect(authService.refresh()).rejects.toThrow();
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    })
});

/*
* 测试AuthService.checkExists
* 检查checkExists是否符合文档定义
* @author lzl
*/
describe('AuthService exist test',() => {
    const username: string = 'test';
    const email: string = 'test';
    /*
    * 测试AuthService.checkExists成功返回值
    * 检查checkExists在无重复时返回true
    * @author lzl
    */
    it("Test normal flow",async ()=>{
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onPost('/auth/exist').reply(() => {return [200]});
        let authService = new AuthService(client);
        await expect(authService.checkExists(username, email)).resolves.toEqual(true);
    });

    /*
    * 测试AuthService.checkExists失败返回值
    * 检查checkExists在重复时返回false
    * @author lzl
    */
    it('Test 403 flow', async () => {
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onPost('/auth/exist').reply(() => {return [403]});
        let authService = new AuthService(client);
        await expect(authService.checkExists(username, email)).resolves.toEqual(false);
    });

    /*
    * 测试AuthService.checkExists异常返回值
    * 检查checkExists在异常时抛出错误
    * @author lzl
    */
    it('Test error flow', async () => {
        let client = axios.create();
        let mock = new MockAdapter(client);
        mock.onPost('/auth/exist').reply(() => {return [500]});
        let authService = new AuthService(client);
        await expect(authService.checkExists(username, email)).rejects.toThrow();
    })
});
=======
import '@testing-library/jest-dom'
import {testAdapter, testAuthService, testUser} from "../mocks/testData";

beforeEach(() => {
  // @ts-ignore
  localStorage.setItem.mockClear();
  // @ts-ignore
  localStorage.removeItem.mockClear();
  localStorage.clear();
})
/*
* 检测 AuthService login 返回值
* 检查 login 成功和异常时返回值是否符合文档定义，检查 localStorage 是否设置成功
* @author wfn
*/
describe('AuthService login test', () => {
  const request = {username: '', password: ''};

  /*
  * 检测 AuthService login 成功返回值
  * login 成功返回用户资料并设置localStorage，检查返回的资料，以及 localStorage 是否设置成功
  * @author wfn
  */
  it("Test normal flow of AuthService login", async () => {
    testAdapter.onPost('/auth/login').reply(config => {
      return [200, {user: testUser, accessToken: "justTestToken", csrfToken: "justTestToken"}]
    });
    await expect(testAuthService.login(request)).resolves.toEqual(testUser);
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem('access_token')).toBe("justTestToken");
    expect(localStorage.getItem('csrf_token')).toBe("justTestToken");
  });

  /*
  * 检测 AuthService login 失败返回值
  * login 用户名或密码错误返回400，应当直接抛出异常
  * @author wfn
  */
  it('Test fail flow of AuthService login', async () => {
    testAdapter.onPost('/auth/login').reply(config => {
      return [403]
    });
    await expect(testAuthService.login(request)).rejects.toThrow();
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  })

  /*
  * 检测 AuthService login 异常返回值
  * login 返回其他网络异常，应当直接抛出异常
  * @author wfn
  */
  it('Test error flow of AuthService login', async () => {
    testAdapter.onPost('/auth/login').reply(config => {
      return [500]
    });
    await expect(testAuthService.login(request)).rejects.toThrow();
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  })
})

/*
* 检测 AuthService logout 返回值
* 检查 logout 成功和异常时返回值是否符合文档定义
* @author wfn
*/
describe('AuthService logout test', () => {
  /*
  * 检测 AuthService logout 成功返回值
  * logout 成功返回 200, logout 函数应当返回 true, 同时检查localStorage被移除两次
  * @author wfn
  */
  it("Test normal flow of AuthService logout", async () => {
    testAdapter.onGet('/auth/logout').reply(config => {
      return [200]
    });
    await expect(testAuthService.logout()).resolves.toEqual(true);
    expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('csrf_token')).toBeNull();
  });

  /*
  * 检测 AuthService logout 成功返回值
  * logout 遇到其他异常直接抛出, 同时检查localStorage被移除
  * @author wfn
  */
  it('Test error flow of AuthService logout', async () => {
    testAdapter.onGet('/auth/logout').reply(config => {
      return [500]
    });
    await expect(testAuthService.logout()).rejects.toThrow();
    expect(localStorage.removeItem).toHaveBeenCalledTimes(0);
  })
})

/*
* 检测 AuthService register 返回值
* 检查 register 成功、失败和异常时返回值是否符合文档定义
* @author wfn
*/
describe('AuthService register test', () => {
  const profile = {
    username: 'test4',
    password: '12345678',
    email: 'test4@test.com'
  }

  /*
  * 检测 AuthService register 成功返回值
  * register 成功返回 true
  * @author wfn
  */
  it("Test normal flow of AuthService register", async () => {
    testAdapter.onPost('/auth/register').reply(config => {
      return [200]
    });
    await expect(testAuthService.register(profile)).resolves.toEqual(true);
  });

  /*
  * 检测 AuthService register 失败返回值
  * register 失败返回 false
  * @author wfn
  */
  it('Test fail flow of AuthService register', async () => {
    testAdapter.onPost('/auth/register').reply(config => {
      return [400]
    });
    await expect(testAuthService.register(profile)).resolves.toEqual(false);
  })

  /*
  * 检测 AuthService register 异常返回值
  * register 异常时直接抛出
  * @author wfn
  */
  it('Test error flow of AuthService register', async () => {
    testAdapter.onPost('/auth/register').reply(config => {
      return [500]
    });
    await expect(testAuthService.register(profile)).rejects.toThrow();
  })
})

/*
* 检测 AuthService ping 返回值
* 检查 ping 成功、失败和异常时返回值是否符合文档定义
* @author wfn
*/
describe('AuthService ping test', () => {
  /*
  * 检测 AuthService ping 成功返回值
  * ping 成功时返回User数据
  * @author wfn
  */
  it("Test normal flow of AuthService ping", async () => {
    testAdapter.onGet('/auth/ping').reply(config => {
      return [200, testUser]
    });
    await expect(testAuthService.ping()).resolves.toEqual(testUser);
  });

  /*
  * 检测 AuthService ping 失败返回值
  * ping 失败时捕获AxiosError，并返回null
  * @author wfn
  */
  it('Test fail flow of AuthService ping', async () => {
    testAdapter.onGet('/auth/ping').reply(config => {
      return [403]
    });
    await expect(testAuthService.ping()).resolves.toEqual(null);
  })

  /*
  * 检测 AuthService ping 异常返回值
  * ping 异常时直接抛出异常
  * @author wfn
  */
  it('Test error flow of AuthService ping', async () => {
    testAdapter.onGet('/auth/ping').reply(config => {
      return [500]
    });
    await expect(testAuthService.ping()).rejects.toThrow();
  })
})

/*
* 检测 AuthService refresh 返回值
* 检查 refresh 成功、失败和异常时返回值是否符合文档定义
* @author wfn
*/
describe('AuthService refresh test', () => {
  const result = {"accessToken": "justTestToken"}

  /*
  * 检测 AuthService refresh 正常状态下的返回值
  * 用户已登录返回 200，是否存在应该返回 false
  * @author wfn
  */
  it("Test normal flow of AuthService refresh", async () => {
    testAdapter.onGet('/auth/refresh').reply(config => {
      return [200, result]
    });
    await expect(testAuthService.refresh()).resolves.toEqual(true);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('access_token')).toBe("justTestToken");
  });

  it('Test fail flow of AuthService refresh', async () => {
    testAdapter.onGet('/auth/refresh').reply(config => {
      return [403]
    });
    await expect(testAuthService.refresh()).resolves.toEqual(false);
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  })

  it('Test error flow of AuthService refresh', async () => {
    testAdapter.onGet('/auth/refresh').reply(config => {
      return [500]
    });
    await expect(testAuthService.refresh()).rejects.toThrow();
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  })
})

/*
* 检测 AuthService checkExist 返回值
* 检查 checkExist 成功、失败和异常时返回值是否符合文档定义
* @author wfn
*/
describe('AuthService exist test', () => {
  const username: string = 'test1';
  const email: string = 'test@test.com';

  /*
  * 检测 AuthService checkExist 正常状态下的返回值
  * 资料未重复返回200，返回true，表示数据无重复
  * @author wfn
  */
  it("Test normal flow of AuthService exist", async () => {
    testAdapter.onPost('/auth/exist').reply(config => {
      return [200]
    });
    await expect(testAuthService.checkExists(username, email)).resolves.toEqual(true);
  });

  /*
  * 检测 AuthService checkExist 正常状态下的返回值
  * 资料有重复返回403，捕获异常并返回false，表示数据有重复
  * @author wfn
  */
  it('Test 403 flow of AuthService exist', async () => {
    testAdapter.onPost('/auth/exist').reply(config => {
      return [403]
    });
    await expect(testAuthService.checkExists(username, email)).resolves.toEqual(false);
  })

  /*
  * 检测 AuthService checkExist 异常状态下的返回值
  * 请求格式错误返回400，应当抛出异常
  * @author wfn
  */
  it('Test 400 flow of AuthService exist', async () => {
    testAdapter.onPost('/auth/exist').reply(config => {
      return [400]
    });
    await expect(testAuthService.checkExists(username, email)).rejects.toThrow();
  })

  /*
  * 检测 AuthService checkExist 异常状态下的返回值
  * 遇到其他异常直接抛出异常
  * @author wfn
  */
  it('Test error flow of AuthService exist', async () => {
    testAdapter.onPost('/auth/exist').reply(config => {
      return [500]
    });
    await expect(testAuthService.checkExists(username, email)).rejects.toThrow();
  })
})



>>>>>>> dev
