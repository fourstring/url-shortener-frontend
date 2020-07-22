import {client} from './network'
<<<<<<< HEAD
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


=======

/*
* 测试 interceptor 设置正确
* 检查 client 在 localStorage 值为空和不为空时成功设置
* @author wfn
*/
describe('Client set correctly test', () => {
  /*
  * 检查 baseURL 和 withCredentials 设置成功
  * @author wfn
  */
  it('should set baseURL and withCredentials correctly', () => {
    expect(client.defaults.baseURL).toBe('http://localhost:8080');
    expect(client.defaults.withCredentials).toBe(true);
  });

  /*
  * 检查 client 在 localStorage 值不为 null时成功设置
  * @author wfn
  */
  it('should add token to headers if localStorage exist', async () => {
    localStorage.setItem('csrf_token', 'token');
    localStorage.setItem('access_token', 'token');
    // @ts-ignore
    const result = client.interceptors.request.handlers[0].fulfilled({headers: {}});
    expect(result.headers['X-CSRFToken']).toBe('token');
    expect(result.headers['Authorization']).toBe('Bearer token');
  });

  /*
  * 检查 client 在 localStorage 值为 null时不设置
  * @author wfn
  */
  it('should not add token to headers if localStorage is null', async () => {
    localStorage.removeItem('csrf_token');
    localStorage.removeItem('access_token');
    // @ts-ignore
    const result = client.interceptors.request.handlers[0].fulfilled({headers: {}});
    expect(result.headers['X-CSRFToken']).toBeUndefined();
    expect(result.headers['Authorization']).toBeUndefined();
  });
})
>>>>>>> dev
