import React from "react";
import App from './App';
import {render,waitFor} from "@testing-library/react";
const jwt = require('jsonwebtoken');

jest.mock('./utils/jwtMonitor');
const monitor = require('./utils/jwtMonitor');

// 让 jest 覆盖全局定时器并重置记录状态
beforeEach(() => jest.useFakeTimers())

/*
* 检测 App
* App是否正确设置
* 调用成功以jwtMonitorRate配置项指定的频率调用jwtMonitor函数
* @author wfn
*/
describe('App test', ()=>{
  it('should do nothing if token is empty string', () => {
    monitor.jwtMonitor.mockImplementation(() => {
      return ''
    })
    render (<App/>);
    waitFor(() =>{
      expect(setInterval).not.toHaveBeenCalled();
    })
  })

  /*
  * 检测 App是否 setInterval
  * 调用成功以jwtMonitorRate配置项指定的频率调用jwtMonitor函数
  * @author wfn
  */
  it('should setInterval if token is defined', () => {
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000 + 1),
      user_id: 1,
      username: 'admin',
      email: 'admin@example.com'
    }, 'secret');
    monitor.jwtMonitor.mockImplementation(() => {
      return token
    })
    render (<App/>);
    waitFor(() =>{
      expect(setInterval).toHaveBeenCalled();
    })
  })
})