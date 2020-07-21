import {AuthService} from './AuthService';
import '@testing-library/jest-dom'
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {IUser} from "../types/IUser";

const user: IUser = {id: 1, username: 'test1', email: 'test@test.com'};
let client = axios.create();
let mock = new MockAdapter(client);

beforeEach(() =>{
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
describe('AuthService login test',() => {
    const request = {username: 'test1', password: ''};

    /*
    * 检测 AuthService login 成功返回值
    * login 成功返回用户资料并设置localStorage，检查返回的资料，以及 localStorage 是否设置成功
    * @author wfn
    */
    it("Test normal flow of AuthService login",async ()=>{
        mock.onPost('/auth/login').reply(config => {
            return [200, {user, accessToken: "justTestToken", csrfToken: "justTestToken"}]
        });
        let authService = new AuthService(client);
        await expect(authService.login(request)).resolves.toEqual(user);
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
        mock.onPost('/auth/login').reply(config => {
            return [403]
        });
        let authService = new AuthService(client);
        await expect(authService.login(request)).rejects.toThrow();
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    })

    /*
    * 检测 AuthService login 异常返回值
    * login 返回其他网络异常，应当直接抛出异常
    * @author wfn
    */
    it('Test error flow of AuthService login', async () => {
        mock.onPost('/auth/login').reply(config => {
            return [500]
        });
        let authService = new AuthService(client);
        await expect(authService.login(request)).rejects.toThrow();
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    })
})

/*
* 检测 AuthService logout 返回值
* 检查 logout 成功和异常时返回值是否符合文档定义
* @author wfn
*/
describe('AuthService logout test',() => {
    /*
    * 检测 AuthService logout 成功返回值
    * logout 成功返回 200, logout 函数应当返回 true, 同时检查localStorage被移除两次
    * @author wfn
    */
    it("Test normal flow of AuthService logout",async ()=>{
        mock.onGet('/auth/logout').reply(config => {
            return [200]
        });
        let authService = new AuthService(client);
        await expect(authService.logout()).resolves.toEqual(true);
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
        mock.onGet('/auth/logout').reply(config => {
            return [500]
        });
        let authService = new AuthService(client);
        await expect(authService.logout()).rejects.toThrow();
        expect(localStorage.removeItem).toHaveBeenCalledTimes(0);
    })
})

/*
* 检测 AuthService register 返回值
* 检查 register 成功、失败和异常时返回值是否符合文档定义
* @author wfn
*/
describe('AuthService register test',() => {
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
    it("Test normal flow of AuthService register",async ()=>{
        mock.onPost('/auth/register').reply(config => {return [200]});
        let authService = new AuthService(client);
        await expect(authService.register(profile)).resolves.toEqual(true);
    });

    /*
    * 检测 AuthService register 失败返回值
    * register 失败返回 false
    * @author wfn
    */
    it('Test fail flow of AuthService register', async () => {
        mock.onPost('/auth/register').reply(config => {return [400]});
        let authService = new AuthService(client);
        await expect(authService.register(profile)).resolves.toEqual(false);
    })

    /*
    * 检测 AuthService register 异常返回值
    * register 异常时直接抛出
    * @author wfn
    */
    it('Test error flow of AuthService register', async () => {
        mock.onPost('/auth/register').reply(config => {return [500]});
        let authService = new AuthService(client);
        await expect(authService.register(profile)).rejects.toThrow();
    })
})

/*
* 检测 AuthService ping 返回值
* 检查 ping 成功、失败和异常时返回值是否符合文档定义
* @author wfn
*/
describe('AuthService ping test',() => {
    /*
    * 检测 AuthService ping 成功返回值
    * ping 成功时返回User数据
    * @author wfn
    */
    it("Test normal flow of AuthService ping",async ()=>{
        mock.onGet('/auth/ping').reply(config => {return [200, user]});
        let authService = new AuthService(client);
        await expect(authService.ping()).resolves.toEqual(user);
    });

    /*
    * 检测 AuthService ping 失败返回值
    * ping 失败时捕获AxiosError，并返回null
    * @author wfn
    */
    it('Test fail flow of AuthService ping', async () => {
        mock.onGet('/auth/ping').reply(config => {return [403]});
        let authService = new AuthService(client);
        await expect(authService.ping()).resolves.toEqual(null);
    })

    /*
    * 检测 AuthService ping 异常返回值
    * ping 异常时直接抛出异常
    * @author wfn
    */
    it('Test error flow of AuthService ping', async () => {
        mock.onGet('/auth/ping').reply(config => {return [500]});
        let authService = new AuthService(client);
        await expect(authService.ping()).rejects.toThrow();
    })
})

/*
* 检测 AuthService refresh 返回值
* 检查 refresh 成功、失败和异常时返回值是否符合文档定义
* @author wfn
*/
describe('AuthService refresh test',() => {
    const result = {"accessToken": "justTestToken"}

    /*
    * 检测 AuthService refresh 正常状态下的返回值
    * 用户已登录返回 200，是否存在应该返回 false
    * @author wfn
    */
    it("Test normal flow of AuthService refresh",async ()=>{
        mock.onGet('/auth/refresh').reply(config => {return [200, result]});
        let authService = new AuthService(client);
        await expect(authService.refresh()).resolves.toEqual(true);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem('access_token')).toBe("justTestToken");
    });

    it('Test fail flow of AuthService refresh', async () => {
        mock.onGet('/auth/refresh').reply(config => {return [403]});
        let authService = new AuthService(client);
        await expect(authService.refresh()).resolves.toEqual(false);
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    })

    it('Test error flow of AuthService refresh', async () => {
        mock.onGet('/auth/refresh').reply(config => {return [500]});
        let authService = new AuthService(client);
        await expect(authService.refresh()).rejects.toThrow();
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    })
})

/*
* 检测 AuthService checkExist 返回值
* 检查 checkExist 成功、失败和异常时返回值是否符合文档定义
* @author wfn
*/
describe('AuthService exist test',() => {
    const username: string = 'test1';
    const email: string = 'test@test.com';

    /*
    * 检测 AuthService checkExist 正常状态下的返回值
    * 资料未重复返回200，返回true，表示数据无重复
    * @author wfn
    */
    it("Test normal flow of AuthService exist",async ()=>{
        mock.onPost('/auth/exist').reply(config => {return [200]});
        let authService = new AuthService(client);
        await expect(authService.checkExists(username, email)).resolves.toEqual(true);
    });

    /*
    * 检测 AuthService checkExist 正常状态下的返回值
    * 资料有重复返回403，捕获异常并返回false，表示数据有重复
    * @author wfn
    */
    it('Test 403 flow of AuthService exist', async () => {
        mock.onPost('/auth/exist').reply(config => {return [403]});
        let authService = new AuthService(client);
        await expect(authService.checkExists(username, email)).resolves.toEqual(false);
    })

    /*
    * 检测 AuthService checkExist 异常状态下的返回值
    * 请求格式错误返回400，应当抛出异常
    * @author wfn
    */
    it('Test 400 flow of AuthService exist', async () => {
        mock.onPost('/auth/exist').reply(config => {return [400]});
        let authService = new AuthService(client);
        await expect(authService.checkExists(username, email)).rejects.toThrow();
    })

    /*
    * 检测 AuthService checkExist 异常状态下的返回值
    * 遇到其他异常直接抛出异常
    * @author wfn
    */
    it('Test error flow of AuthService exist', async () => {
        mock.onPost('/auth/exist').reply(config => {return [500]});
        let authService = new AuthService(client);
        await expect(authService.checkExists(username, email)).rejects.toThrow();
    })
})



