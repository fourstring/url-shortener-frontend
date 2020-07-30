import React from "react";
import {testUser} from "../mocks/testData";
import {fireEvent, render, waitFor, act} from "@testing-library/react";
import {Router as BasicRouter} from "react-router";
import {createMemoryHistory} from "history";
import {UserIndicator} from "./UserIndicator";

/*
* 检测 UserIndicator
* UserIndicator 是否正确渲染
* @author wfn
*/
describe('UserIndicator test', () => {
  /*
  * 检测 UserIndicator 用户存在情况
  * 用户存在时，UserIndicator显示头像，点击avatar后显示菜单栏，点击相应item时跳转
  * TODO：检测再次点击avatar后菜单栏隐藏
  * @author wfn
  */
  it('should render components correctly with user', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/']
    });
    const {getByText} = render(
      <BasicRouter history={history}>
        <h1>click</h1>
        <UserIndicator user={testUser}/>
      </BasicRouter>
    );
    const avatar = getByText(testUser.username[0].toUpperCase());
    expect(avatar).toBeInTheDocument();

    /* 点击avatar后显示菜单栏 */
    act(() => {
      fireEvent.click(avatar);
    })
    expect(getByText("我的信息")).toBeInTheDocument();
    expect(getByText("退出登陆")).toBeInTheDocument();

    /* 再次点击avatar后菜单栏隐藏 */
    act(() => {
      fireEvent.click(getByText("click"));
    })
    await waitFor(() => {});

    /* 点击时跳转 */
    act(() => {
      fireEvent.click(avatar);
      fireEvent.click(getByText("我的信息"));
    })
    await waitFor(() => {});
    expect(history.location.pathname).toBe("/my");

    act(() => {
      history.push('/');
      fireEvent.click(avatar);
      fireEvent.click(getByText("退出登陆"));
    })
    await waitFor(() => {});
    expect(history.location.pathname).toBe("/logout");
  });

  /*
  * 检测 UserIndicator 用户不存在情况
  * 用户不存在时，UserIndicator不显示头像
  * @author wfn
  */
  it('should not render components without user', async () => {
    const {getByText} = render(
      <UserIndicator user={null}/>
    );
    await expect(waitFor(() =>
      getByText(testUser.username[0].toUpperCase()))
    ).rejects.toThrow();
  });
});