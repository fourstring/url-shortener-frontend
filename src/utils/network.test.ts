import {client} from './network'
import 'jest-localstorage-mock';

/*
* 测试interceptor.request.use()
* 检查未成功设置localStorage中两个token的情况下是否返回undefined
* @author lzl
*/
describe('Test interceptor when request if localStorage is empty', () => {
    beforeEach(()=>{
        localStorage.clear();
        localStorage.setItem.mockClear();
        localStorage.getItem.mockClear();
    });

    /*
    * 测试interceptor.request.use()
    * 检查未成功设置localStorage中两个token的情况下是否返回undefined
    * @author lzl
    */
    it('interceptor adds token to config',async () =>{
        const result = client.interceptors.request.handlers[0].fulfilled({headers: {}});
        expect(result.headers['X-CSRFToken']).toBeUndefined();
        expect(result.headers['Authorization']).toBeUndefined();
    });

});

/*
* 测试interceptor.request.use()
* 检查成功设置localStorage中两个token的情况下是否设置成功
* @author lzl
*/
describe('Test interceptor when request if localStorage is not empty', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem.mockClear();
        localStorage.getItem.mockClear();
        localStorage.setItem('csrf_token','token');
        localStorage.setItem('access_token','token');
    });

    /*
    * 测试interceptor.request.use()
    * 检查成功设置localStorage中两个token的情况下是否设置成功
    * @author lzl
    */
    it('interceptor adds token to config',async () =>{
        let result = client.interceptors.request.handlers[0].fulfilled({headers: {}});
        expect(result.headers['X-CSRFToken']).toBe('token');
        expect(result.headers['Authorization']).toBe('token');
    });

    /*
    * 测试interceptor.request.use()
    * 检查config是否成功返回，设置baseURL
    * @author lzl
    */
    it('Test baseURL setting',()=>{
        expect(client.defaults.baseURL).toBe('http://localhost:8080');
    });
});


