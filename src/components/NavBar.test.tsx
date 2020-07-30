import '@testing-library/jest-dom/extend-expect'
import React, {useState} from 'react'
import {act, fireEvent, render, waitFor} from '@testing-library/react'
import {renderHook} from '@testing-library/react-hooks'
import {NavBar} from './NavBar'
import {Router as BasicRouter} from "react-router-dom";
import {Router} from '../router/Router'
import {createMemoryHistory} from 'history'
import {IRoute} from "../types/IRouter";
import {UserContext} from "../contexts/UserContext";
import {IUser} from "../types/IUser";
import {testUser} from "../mocks/testData"

const routes: IRoute[] = [
  {
    path: '/t1',
    component: <NavBar/>,
    metadata: {
      display: true,
      displayText: 'Test1',
      anonymousOnly: true,
    }
  },
  {
    path: '/t2',
    component: <NavBar/>,
    metadata: {
      display: false,
      displayText: 'Test2'
    }
  },
  {
    path: '/t3',
    component: <NavBar/>,
    metadata: {
      display: true,
      displayText: 'Test3',
      authenticatedOnly: true
    }
  },
  {
    path: '/',
    component: <NavBar/>,
    metadata: {
      display: true,
      displayText: 'Test0'
    }
  }
]

/*
* 检测 NavBar
* NavBar是否正确渲染
* @author wfn
*/
describe('NavBar test', () => {
  /*
  * 检测 NavBar 用户存在情况
  * 用户存在时，NavBar根据路由配置的属性渲染相应内容
  * @author wfn
  */
  it('should render components according to props correctly', async () => {
    const {result} = renderHook(() => useState<IUser | null>(testUser))
    const [user, setUser] = result.current;
    const history = createMemoryHistory({
      initialEntries: ['/']
    });
    const {getByText} = render(
      <UserContext.Provider value={{user, setUser}}>
        <BasicRouter history={history}>
          <Router routes={routes}/>
        </BasicRouter>
      </UserContext.Provider>
    );
    expect(getByText("Test0")).toBeInTheDocument();
    expect(getByText("Test3")).toBeInTheDocument();
    await expect(waitFor(() =>
      getByText("Test1"))).rejects.toThrow();
    await expect(waitFor(() =>
      getByText("Test2"))).rejects.toThrow();
  });

  /*
  * 检测 NavBar 用户不存在情况
  * 用户不存在时，NavBar根据路由配置的属性渲染相应内容
  * 点击后跳转至相应的路由界面
  * @author wfn
  */
  it('should render components according to props correctly without user', async () => {
    const {result} = renderHook(() => useState<IUser | null>(null))
    const [user, setUser] = result.current;
    const history = createMemoryHistory({
      initialEntries: ['/']
    });
    const {getByText} = render(
      <UserContext.Provider value={{user, setUser}}>
        <BasicRouter history={history}>
          <Router routes={routes}/>
        </BasicRouter>
      </UserContext.Provider>
    );
    expect(getByText("Test0")).toBeInTheDocument();
    expect(getByText("Test1")).toBeInTheDocument();
    await expect(waitFor(() =>
      getByText("Test2"))).rejects.toThrow();
    await expect(waitFor(() =>
      getByText("Test3"))).rejects.toThrow();

    act(() => {
      fireEvent.click(getByText("Test1"));
    })
    expect(history.location.pathname).toEqual('/t1');
  });

  /*
  * 检测 NavBar url 错误情况
  * url 错误或者该界面不存在NavBar时，NavBar不渲染
  * @author wfn
  */
  it('should not render with wrong url', async () => {
    const {result} = renderHook(() => useState<IUser | null>(testUser))
    const [user, setUser] = result.current;
    const history = createMemoryHistory({
      initialEntries: ['/wrongUrl']
    });
    const {getByText} = render(
      <UserContext.Provider value={{user, setUser}}>
        <BasicRouter history={history}>
          <Router routes={routes}/>
        </BasicRouter>
      </UserContext.Provider>
    );
    await expect(waitFor(() =>
      getByText("我的短链接"))).rejects.toThrow();
  });
});