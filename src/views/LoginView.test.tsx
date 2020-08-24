import '@testing-library/jest-dom'
import React, {useState} from 'react'
import {Router as BasicRouter} from "react-router";
import {fireEvent, render, waitFor} from "@testing-library/react";
import {LoginView} from "./LoginView";
import {UserContext} from "../contexts/UserContext";
import {IUser} from "../types/IUser";
import {createMemoryHistory} from "history";
import {getByDeepText} from "../utils/getByDeepText";
import {authService} from "../services/AuthService";
import {testUser} from "../mocks/testData";
import {testAdapter, testClient} from "../mocks/testClient";

authService.client = testClient;
/*
* 前期准备工作
* 因为检测页面跳转不太方便，为history.replace添加一个 mock
*/
const setup = () => {
  testAdapter.onPost('/auth/login').reply(config => {
    return [200, {user: testUser, accessToken: "justTestToken", csrfToken: "justTestToken"}]
  })
  const mockHistoryReplace = jest.fn();
  const history = createMemoryHistory({
    initialEntries: ['/'],
  });
  history.replace = mockHistoryReplace;
  const TestComponent = () => {
    const [user, setUser] = useState<IUser | null>(null);
    return (
      <UserContext.Provider value={{user, setUser}}>
        <BasicRouter history={history}>
          <LoginView/>
        </BasicRouter>
      </UserContext.Provider>
    )
  }
  const {getByPlaceholderText, getByText} = render(<TestComponent/>)

  return {mockHistoryReplace, getByPlaceholderText, getByText}
}
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.clearAllTimers());
/*
* 检测 LoginView
* LoginView 是否正确响应用户的不同操作
* @author wfn
*/
describe('LoginView test', () => {
  /*
  * 检测 LoginView 成功登陆
  * LoginView 应当正确跳转，当所有的输入正确
  * @author wfn
  */
  it('should redirect to home after successfully login', async () => {
    const {mockHistoryReplace, getByPlaceholderText, getByText} = setup();
    fireEvent.change(getByPlaceholderText("请输入用户名"), {
      target: {value: 'username'}
    })
    fireEvent.change(getByPlaceholderText("请输入密码"), {
      target: {value: '0123456789'}
    })
    fireEvent.click(
      getByText('登陆')
    );
    await waitFor(() => {
      expect(mockHistoryReplace).toHaveBeenCalledWith('/');
    });
  });

  /*
  * 检测 LoginView 前往注册
  * LoginView 应当前往注册页面当我们点击注册按钮
  * @author wfn
  */
  it('should redirect to register page if clicked register', async () => {
    const {mockHistoryReplace, getByText} = setup();
    fireEvent.click(getByText("注册"))
    await waitFor(() => {
      expect(mockHistoryReplace).toHaveBeenCalledWith('/register');
    });
  });
})

/*
* 检测 LoginView 报错
* 检测 LoginView 正确提示相应的输入错误，提交错误
* @author wfn
*/
describe('LoginView handle error test', () => {
  /*
  * 检测 LoginView 报错
  * 当用户名过短时应该提示用户
  * @author wfn
  */
  it('should warn if username is too short', async () => {
    const {getByText, getByPlaceholderText} = setup();
    fireEvent.change(getByPlaceholderText("请输入用户名"), {
      target: {value: '1'}
    })
    fireEvent.click(getByText("登陆"))
    await waitFor(() => {
      expect(getByDeepText('username must be at least 4 characters')).toBeInTheDocument();
    })
  })

  /*
  * 检测 LoginView 报错
  * 当密码过短时应该提示用户
  * @author wfn
  */
  it('should warn if password is too short', async () => {
    const {getByText, getByPlaceholderText} = setup();
    fireEvent.change(getByPlaceholderText("请输入密码"), {
      target: {value: '1'}
    })
    fireEvent.click(getByText("登陆"))
    await waitFor(() => {
      expect(getByDeepText('password must be at least 8 characters')).toBeInTheDocument();
    })
  })

  /*
  * 检测 LoginView 报错
  * 当没有输入时就提交提示需要输入
  * @author wfn
  */
  it('should warn if nothing enter', async () => {
    const {getByText} = setup();
    fireEvent.click(getByText("登陆"))
    await waitFor(() => {
      expect(getByDeepText('username is a required field')).toBeInTheDocument();
      expect(getByDeepText('password is a required field')).toBeInTheDocument();
    })
  })
})
