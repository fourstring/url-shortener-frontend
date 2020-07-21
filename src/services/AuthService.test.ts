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
