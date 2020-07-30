import {client} from './network'
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
