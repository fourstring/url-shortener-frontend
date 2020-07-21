import {client} from './network'

/*
* 测试 interceptor 设置正确
* 检查 client 在 localStorage 值不为 null时成功设置
* @author ydx
*/
describe('interceptor adds token to config if localStorage exists', () => {
    beforeAll(()=>{
        localStorage.setItem('csrf_token','token');
        localStorage.setItem('access_token','token');
    })

    /*
    * 检查 client 在 localStorage 值不为 null时成功设置
    * @author ydx
    */
    it('interceptor adds token to config',async () =>{
        // const data = await client.get('/test');
        const result = client.interceptors.request.handlers[0].fulfilled({headers: {}});
        expect(result.headers['X-CSRFToken']).toBe('token');
        expect(result.headers['AccessToken']).toBe('token');
    });

    /*
    * 检查 baseURL 和 withCredentials 设置成功
    * @author ydx
    */
    it('create successfully',()=>{
        expect(client.defaults.baseURL).toBe('http://localhost:8080');
        expect(client.defaults.withCredentials).toBe(true);
    });
})

/*
* 测试 interceptor 设置正确
* 检查 client 在 localStorage 值为 null 时不设置 headers
* @author ydx
*/
describe('interceptor adds token to config if localStorage not exists', () => {
    beforeAll(()=>{
        localStorage.removeItem('csrf_token');
        localStorage.removeItem('access_token');
    })

    /*
    * 检查 client 在 localStorage 值为 null时不设置
    * @author ydx
    */
    it('interceptor adds token to config',async () =>{
        // const data = await client.get('/test');
        const result = client.interceptors.request.handlers[0].fulfilled({headers: {}});
        expect(result.headers['X-CSRFToken']).toBeUndefined();
        expect(result.headers['AccessToken']).toBeUndefined();
    });
})