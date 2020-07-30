import axios from "axios";
import {jwtMonitor, monitorId, setMonitorId} from './jwtMonitor'
import {authService} from "../services/AuthService";
import MockAdapter from "axios-mock-adapter";
let jwt = require('jsonwebtoken');

let testClient = axios.create();
let testAdapter = new MockAdapter(testClient);
authService.client = testClient;

// signing two token with a within time exp and out of time exp
const token = jwt.sign({
  exp: Math.floor(Date.now() / 1000 + 1),
}, 'secret');
const outOfTimeToken = jwt.sign({exp: 0}, 'secret');

/*
* 检测 jwtMonitor
* 检查 jwtMonitor 在多种情况下行为是否符合文档定义
* @author wfn
*/
describe('jwtMonitor test',  () => {
  beforeEach(() => {
    // @ts-ignore
    localStorage.setItem.mockClear();
    // @ts-ignore
    localStorage.removeItem.mockClear();
    localStorage.clear();
  })

  /*
  * 检测 jwtMonitor 在 localStorage 中 access_toke 不存在时行为
  * access_toke 不存在说明用户未登陆，则直接返回空字符串
  * @author wfn
  */
  it('should return empty string if accessToken does not exist', async () => {
    localStorage.removeItem('access_token');
    const result = await jwtMonitor();
    expect(result).toEqual('');
  })

  /*
  * 检测 jwtMonitor 在 access_toke 存在且时间差小于阈值时行为
  * 检查 jwtMonitor 直接返回 localStorage 中现有的 access_token
  * @author wfn
  */
  it('should return token now if the time difference is less than jwtRefreshThreshold', async () => {
    localStorage.setItem('access_token',token);
    const result = await jwtMonitor();
    expect(result).toEqual(token);
  })

  /*
  * 检测 jwtMonitor 在时间差大于阈值而refresh成功时行为
  * 检查调用 refresh 刷新本地 access_token
  * 检查 jwtMonitor 返回刷新后的 access_token
  * @author wfn
  */
  it('should return new token if the time difference is greater than threshold and successfully refresh', async () => {
    testAdapter.onGet('/auth/refresh').reply(config => {
      return [200, {"accessToken": token}]
    });
    localStorage.setItem('access_token', outOfTimeToken);
    const result = await jwtMonitor();
    expect(localStorage.getItem('access_token')).toEqual(token);
    expect(result).toEqual(token);
  })

  /*
  * 检测 jwtMonitor 在时间差大于阈值而refresh失败时行为
  * 刷新失败，则说明用户已因超时登出或手动登出，检查函数将localStorage中的access_token删除
  * 检查 jwtMonitor 返回空字符串
  * @author wfn
  */
  it('should return empty string and remove local token if the time difference is greater but failed to refresh', async () => {
    testAdapter.onGet('/auth/refresh').reply(config => {
      return [403]
    });
    localStorage.setItem('access_token', outOfTimeToken);
    const result = await jwtMonitor();
    expect(result).toEqual('');
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('access_token')).toBeNull();
  })

  /*
  * 检测 jwtMonitor 失败时调用如果传入的函数
  * 检查当传入了onFailed函数，则调用该函数
  * @author wfn
  */
  it('should call func onFail if it is provided when fail', async () => {
    testAdapter.onGet('/auth/refresh').reply(config => {
      return [403]
    });
    localStorage.setItem('access_token', outOfTimeToken);
    const onFail = jest.fn();
    await jwtMonitor(onFail);
    expect(onFail).toHaveBeenCalled();
  })
})

/*
* 检测 setMonitorId 功能
* setMonitorId 应当正确设置 monitorId
* @author wfn
*/
it('setMonitorId test', () => {
  setMonitorId(0);
  expect(monitorId).toBe(0);
  setMonitorId(5);
  expect(monitorId).toBe(5);
})