import '@testing-library/jest-dom'
import React, {useContext, useState} from "react";
import { fireEvent, render, waitFor, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {ShortenView} from "./ShortenView";
import {
  testAdapter,
  testLink,
  testLinkInput,
  testLinkService,
  testPagedData,
  testRequestFilterOptions, testUser
} from "../mocks/testData";
import {IRoute} from "../types/IRouter";
import {createMemoryHistory} from "history";
import {Router as BasicRouter} from "react-router";
import {Router} from "../router/Router";
import {UserContext, UserContextType} from "../contexts/UserContext";
import {IUser} from "../types/IUser";
import { renderHook } from '@testing-library/react-hooks'
import {routes} from "../routes";

function getByDeepText(text: string) {
  return screen.getByText((content: string, node: Element) => {
    const hasText = (node: Element) => node.textContent === text;
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node.children).every(
      (child: Element) => !hasText(child)
    );
    return nodeHasText && childrenDontHaveText;
  });
}

/*
* 前期准备工作
* 因为检测页面跳转不太方便，为history.replace添加一个 mock
*/
const setup = () => {
  const {result} = renderHook(() => useState<IUser | null>(null))
  const [user, setUser] = result.current
  const mockHistoryReplace = jest.fn();
  const history = createMemoryHistory({
    initialEntries: ['/'],
  });
  history.replace = mockHistoryReplace;
  const {getByPlaceholderText, getByText} = render(<UserContext.Provider value={{user, setUser}}>
    <BasicRouter history={history}>
      <ShortenView/>
    </BasicRouter>
  </UserContext.Provider>)

  return {mockHistoryReplace, getByPlaceholderText, getByText, setUser}
}



/*
* 测试生成按钮
* 检查登陆和未登录两种状态下的返回
* @author lzl
*/

describe('Test shorter button', () => {
  // const {setUser} = useContext(UserContext) as UserContextType;
  /*
  * 测试生成按钮
  * 检查未登录状态下是否返回一个"请先登录"提示
  * @author lzl
  */
  it("Test when not login", async () => {
    const {mockHistoryReplace, getByPlaceholderText, getByText, setUser} = setup();
    setUser(null);
    fireEvent.click(getByDeepText('生成短链接'));
    expect(getByText('请先登录！')).toBeInTheDocument();
  });

  /*
  * 测试生成按钮
  * 检查登录状态下是否正常返回一个链接
  * @author lzl
  */
  it("Test when login", async () => {
    const {mockHistoryReplace, getByPlaceholderText, getByText, setUser} = setup();
    testAdapter.onPost('/links').reply(config => {
      return [200 ,testLink];
    });
    // fireEvent.change(getByPlaceholderText("原链接"), {
    //   target: { value: 'test' }
    // });
    act(() => {
      setUser({id: 1, username: 'string', email: "user@example.com"});
    })
    fireEvent.click(getByDeepText('生成短链接'));
    expect(getByDeepText('短链接: string')).toBeInTheDocument();
  });
});

/*
* 测试ShowAll按钮
* 检查登陆和未登录两种状态下的返回
* @author lzl
*/

describe('Test showAll button', () => {
  const {setUser} = useContext(UserContext) as UserContextType;
  /*
  * 测试ShowAll按钮
  * 检查未登录状态下是否返回一个"请先登录"提示
  * @author lzl
  */
  it("Test when not login", async () => {
    const {mockHistoryReplace, getByPlaceholderText, getByText} = setup();
    setUser(null);
    fireEvent.click(getByDeepText('查看所有短链接'));
    expect(getByText('请先登录！')).toBeInTheDocument();
  });

  /*
  * 测试ShowAll按钮
  * 检查登录状态下是否正常返回一个链接
  * @author lzl
  */
  it("Test when login", async () => {
    const {mockHistoryReplace, getByPlaceholderText, getByText} = setup();
    fireEvent.change(getByPlaceholderText("原链接"), {
      target: { value: 'test' }
    });
    act(() => {
      setUser({id: 1, username: 'string', email: "user@example.com"});
    })
    fireEvent.click(getByDeepText('查看所有短链接'));
    expect(mockHistoryReplace).toHaveBeenCalledWith('/links');
  });
});
