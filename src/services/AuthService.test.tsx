import {AuthService} from './AuthService';
import '@testing-library/jest-dom'
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {user} from "../mocks/mockDb"

let client = axios.create();
let mock = new MockAdapter(client);

beforeEach(() =>{
    jest.resetAllMocks();
})

/*
* AuthService login
* 测试内容：login 成功、失败、异常 时的返回值，检查 localStorage
* @author ydx
*/
describe('AuthService login test',() => {
    const request = {username: 'usrname', password: 'pwd'};

    /*
    * 1.login成功时的返回值
    * 正确结果：返回用户信息，并设置localstorage(被调用两次)
    * @author ydx
    */
    it("when AuthService login succeed",async ()=>{
        mock.onPost('/auth/login').reply(config => {
            return [200, {user, accessToken: "aToken", csrfToken: "cToken"}]
        });
        let authService = new AuthService(client);
        await expect(authService.login(request)).resolves.toEqual(user);
        expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    });

    /*
    * 2.login失败时的返回值
    * 正确结果：用户名或密码错误返回403，直接抛出异常
    * localstorage(没有被调用过)
    * @author ydx
    */
    it('when AuthService login fail', async () => {
        mock.onPost('/auth/login').reply(config => {
            return [403]
        });
        let authService = new AuthService(client);
        await expect(authService.login(request)).rejects.toThrow();
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    })

    /*
    * 3.login异常时的返回值
    * 正确结果：返回网络异常，直接抛出异常
    * localstorage(没有被调用过)
    * @author ydx
    */
    it('when AuthService login error', async () => {
        mock.onPost('/auth/login').reply(() => {
            return [500]
        });
        let authService = new AuthService(client);
        await expect(authService.login(request)).rejects.toThrow();
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    })
})

/*
* AuthService logout
* 测试内容：logout 成功和异常时的返回值
* @author ydx
*/
describe('AuthService logout test',() => {

    /*
    * 1.logout成功时的返回值
    * 正确结果：返回200，并移除localstorage(被调用两次)
    * @author ydx
    */
    it("when AuthService logout succeed",async ()=>{
        mock.onGet('/auth/logout').reply(config => {
            return [200]
        });
        let authService = new AuthService(client);
        await expect(authService.logout()).resolves.toEqual(true);
        expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
    });

    /*
    * 2.logout异常时的返回值
    * 正确结果：直接抛出异常，并移除localstorage(被调用两次)
    * @author ydx
    */
    it('when AuthService logout error', async () => {
        mock.onGet('/auth/logout').reply(config => {
            return [500]
        });
        let authService = new AuthService(client);
        await expect(authService.logout()).rejects.toThrow();
        expect(localStorage.removeItem).toHaveBeenCalledTimes(0);
    })
})

/*
* AuthService register
* 测试内容：register 成功、失败、异常 时的返回值
* @author ydx
*/
describe('AuthService register test',() => {
    const profile = {
        username: 'test',
        password: 'pwd',
        email: 'test@gmail.com'
    }

    /*
    * 1.register 成功时的返回值
    * 正确结果：返回true
    * @author ydx
    */
    it("when AuthService register succeed",async ()=>{
        mock.onPost('/auth/register').reply(config => {return [200]});
        let authService = new AuthService(client);
        await expect(authService.register(profile)).resolves.toEqual(true);
    });

    /*
    * 2. register 失败时的返回值
    * 正确结果：返回false
    * @author ydx
    */
    it('when AuthService register fail', async () => {
        mock.onPost('/auth/register').reply(config => {return [400]});
        let authService = new AuthService(client);
        await expect(authService.register(profile)).resolves.toEqual(false);
    })

    /*
    * 3. register 异常时的返回值
    * 正确结果：抛出异常
    * @author ydx
    */
    it('when AuthService register error', async () => {
        mock.onPost('/auth/register').reply(config => {return [500]});
        let authService = new AuthService(client);
        await expect(authService.register(profile)).rejects.toThrow();
    })
})

/*
* AuthService ping
* 测试内容：ping 成功、失败、异常 时返回值
* @author ydx
*/
describe('AuthService ping test',() => {
    /*
    * 1. ping 成功
    * 正确结果：返回User
    * @author ydx
    */
    it("when AuthService ping succeed",async ()=>{
        mock.onGet('/auth/ping').reply(config => {return [200, user]});
        let authService = new AuthService(client);
        await expect(authService.ping()).resolves.toEqual(user);
    });

    /*
    * 2. ping 失败
    * 正确结果：返回null
    * @author ydx
    */
    it('when AuthService ping fail', async () => {
        mock.onGet('/auth/ping').reply(config => {return [403]});
        let authService = new AuthService(client);
        await expect(authService.ping()).resolves.toEqual(null);
    })

    /*
    * 3. ping 异常
    * 正确结果：抛出异常
    * @author ydx
    */
    it('Test error flow of AuthService ping', async () => {
        mock.onGet('/auth/ping').reply(config => {return [500]});
        let authService = new AuthService(client);
        await expect(authService.ping()).rejects.toThrow();
    })
})

/*
* AuthService refresh
* 测试内容：refresh 成功、失败、异常 时返回值
* @author ydx
*/
describe('AuthService refresh test',() => {
    const result = {"accessToken": "string"}

    /*
    * 1. refresh 成功
    * 正确结果：返回 200，是否存在应该返回 false
    * @author ydx
    */
    it("when AuthService refresh succeed",async ()=>{
        mock.onGet('/auth/refresh').reply(config => {return [200, result]});
        let authService = new AuthService(client);
        await expect(authService.refresh()).resolves.toEqual(true);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });

    /*
    * 2. refresh 失败
    * 正确结果：返回 403，是否存在应该返回 false
    * @author ydx
    */

    it('when AuthService refresh fail', async () => {
        mock.onGet('/auth/refresh').reply(config => {return [403]});
        let authService = new AuthService(client);
        await expect(authService.refresh()).resolves.toEqual(false);
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    })

    /*
    * 3. refresh 异常
    * 正确结果：直接抛出异常
    * @author ydx
    */

    it('when AuthService refresh error', async () => {
        mock.onGet('/auth/refresh').reply(config => {return [500]});
        let authService = new AuthService(client);
        await expect(authService.refresh()).rejects.toThrow();
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    })
})

/*
* AuthService checkExist
* 测试内容：refresh 成功、失败、异常 时返回值
* @author ydx
*/
describe('AuthService exist test',() => {
    const username: string = 'test1';
    const email: string = 'test@test.com';

    /*
    * 成功
    */
    it("when AuthService exist succeed",async ()=>{
        mock.onPost('/auth/exist').reply(config => {return [200]});
        let authService = new AuthService(client);
        await expect(authService.checkExists(username, email)).resolves.toEqual(true);
    });

    /*
    * 失败
    */
    it('when AuthService exist fail', async () => {
        mock.onPost('/auth/exist').reply(config => {return [403]});
        let authService = new AuthService(client);
        await expect(authService.checkExists(username, email)).resolves.toEqual(false);
    })

    /*
    * 格式不一致
    */
    it('when AuthService exist 400', async () => {
        mock.onPost('/auth/exist').reply(config => {return [400]});
        let authService = new AuthService(client);
        await expect(authService.checkExists(username, email)).rejects.toThrow();
    })

    /*
    * 异常
    */
    it('when AuthService exist error', async () => {
        mock.onPost('/auth/exist').reply(config => {return [500]});
        let authService = new AuthService(client);
        await expect(authService.checkExists(username, email)).rejects.toThrow();
    })
})



