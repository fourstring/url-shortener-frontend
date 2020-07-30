import '@testing-library/jest-dom'
import React, {useState} from 'react'
import {fireEvent, render, waitFor} from "@testing-library/react";
import {RegisterView} from "./RegisterView";
import {UserContext} from "../contexts/UserContext";
import {createMemoryHistory} from "history";
import {renderHook} from "@testing-library/react-hooks";
import {IUser} from "../types/IUser";
import {Router as BasicRouter} from "react-router";
import {authService} from "../services/AuthService";
import {getByDeepText} from "../utils/getByDeepText";
import {testClient, testAdapter} from "../mocks/testClient";

authService.client = testClient;
/*
* sleep ms
* 在 javascript 中模拟睡眠函数
*/
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
      <RegisterView/>
    </BasicRouter>
  </UserContext.Provider>)

  return {mockHistoryReplace, getByPlaceholderText, getByText}
}

/*
* 一系列点击操作
* 输入的全部是合法的内容
*/
const enterFields = (getByPlaceholderText: any) => {
  fireEvent.change(getByPlaceholderText("请输入邮箱"), {
    target: {value: 'username@sjtu.edu.cn'}
  })
  fireEvent.change(getByPlaceholderText("请输入用户名"), {
    target: {value: 'username'}
  })
  fireEvent.change(getByPlaceholderText("请输入密码"), {
    target: {value: '0123456789'}
  })
  fireEvent.change(getByPlaceholderText("请确认密码"), {
    target: {value: '0123456789'}
  })
}

/*
* 检测 RegisterView
* LoginView 是否正确响应用户的不同操作
* @author wfn
*/
describe('RegisterView test', () => {
  /*
  * 检测 RegisterView 注册成功
  * 当用户注册成功并且点击Alert中的注册按钮会跳转到注册页面
  * @author wfn
  */
  it('should show login after successfully register', async () => {
    testAdapter.onPost('/auth/register').reply(config => {
      return [200]
    });
    testAdapter.onPost('/auth/exist').reply(config => {
      return [200]
    });
    const {mockHistoryReplace, getByPlaceholderText, getByText} = setup();
    /* enter field */
    enterFields(getByPlaceholderText);
    fireEvent.click(
      getByText('注册')
    );
    await waitFor(() => {
      expect(getByDeepText('登陆')).toBeInTheDocument();
    })
    fireEvent.click(
      getByDeepText('登陆')
    );
    await waitFor(() => {
      expect(mockHistoryReplace).toHaveBeenCalledWith('/login');
    });
  });

  /*
  * 检测 RegisterView 注册成功
  * 当用户注册成功，没有点击Alert中的注册按钮会过一段时间自动隐藏
  * @author wfn
  */
  it('should show login after successfully register', async () => {
    testAdapter.onPost('/auth/register').reply(config => {
      return [200]
    });
    testAdapter.onPost('/auth/exist').reply(config => {
      return [200]
    });
    const {getByPlaceholderText, getByText} = setup();
    enterFields(getByPlaceholderText);
    fireEvent.click(
      getByText('注册')
    );
    await waitFor(() => {
      expect(getByDeepText('登陆')).toBeInTheDocument();
    })
    /* Alert 3s 后自动消失 */
    await sleep(3000);
    await waitFor(() => {
      expect(getByDeepText('登陆')).not.toBeVisible();
    })
  });

  /*
  * 检测 RegisterView 注册失败
  * 当用户注册出现问题，会跳出 Alert 并提示“注册出现问题！请联系管理员”
  * 过一段时间自动隐藏
  * @author wfn
  */
  it('should alert error if fail to register', async () => {
    testAdapter.onPost('/auth/register').reply(config => {
      return [400]
    });
    testAdapter.onPost('/auth/exist').reply(config => {
      return [200]
    });
    const {getByText, getByPlaceholderText} = setup();
    enterFields(getByPlaceholderText);
    fireEvent.click(
      getByText('注册')
    );
    await waitFor(() => {
      expect(getByDeepText('注册出现问题！请联系管理员。')).toBeVisible();
    })
    /* Alert 3s 后自动消失 */
    await sleep(3000);
    await waitFor(() => {
      expect(getByDeepText('注册出现问题！请联系管理员。')).not.toBeVisible();
    })
  });

  /*
  * 检测 RegisterView reset
  * 当点击 reset 按钮会将几个输入框全部清空
  * @author wfn
  */
  it('should set empty if click reset', async () => {
    const {getByText, getByPlaceholderText} = setup();
    enterFields(getByPlaceholderText);
    fireEvent.click(
      getByText('重置')
    );
    await waitFor(() => {
      expect(getByPlaceholderText("请输入邮箱"))
        .toHaveAttribute('value', '');
      expect(getByPlaceholderText("请输入用户名"))
        .toHaveAttribute('value', '');
      expect(getByPlaceholderText("请输入密码"))
        .toHaveAttribute('value', '');
      expect(getByPlaceholderText("请确认密码"))
        .toHaveAttribute('value', '');
    })
  });
})

/*
* 检测 RegisterView 报错
* 检测 RegisterView 正确提示相应的输入错误，提交错误
* @author wfn
*/
describe('RegisterView handle error test', () => {
  /*
  * 检测 RegisterView 注册失败
  * 当用户注册的名字已经存在，会提示“用户名重复！”
  * @author wfn
  */
  it('should error if exist', async () => {
    testAdapter.onPost('/auth/exist').reply(config => {
      return [403]
    });
    const {getByText, getByPlaceholderText} = setup();
    enterFields(getByPlaceholderText);
    fireEvent.click(
      getByText('注册')
    );
    await waitFor(() => {
      expect(getByText('用户名重复！')).toBeInTheDocument();
    })
  });

  /*
  * 检测 RegisterView 报错
  * 当输入错误的邮箱格式时提示格式错误
  * @author wfn
  */
  it('should warn if email if wrong', async () => {
    testAdapter.onPost('/auth/exist').reply(config => {
      return [200]
    });
    const {getByText, getByPlaceholderText} = setup();
    fireEvent.change(getByPlaceholderText("请输入邮箱"), {
      target: {value: 'email'}
    })
    fireEvent.click(getByText("注册"))
    await waitFor(() => {
      expect(getByDeepText('email must be a valid email')).toBeInTheDocument();
    })
  })

  /*
  * 检测 RegisterView 报错
  * 当两次输入的密码不相同时提示密码必须相同
  * @author wfn
  */
  it('should warn if password is not the same', async () => {
    const {getByText, getByPlaceholderText} = setup();
    fireEvent.change(getByPlaceholderText("请输入密码"), {
      target: {value: '123456789'}
    })
    fireEvent.change(getByPlaceholderText("请确认密码"), {
      target: {value: '123456780'}
    })
    fireEvent.click(getByText("注册"))
    await waitFor(() => {
      expect(getByDeepText('必须与密码一致')).toBeInTheDocument();
    })
  })

  /*
  * 检测 RegisterView 报错
  * 当没有输入时就提交提示需要输入
  * @author wfn
  */
  it('should warn if nothing enter', async () => {
    const {getByText} = setup();
    fireEvent.click(getByText("注册"))
    await waitFor(() => {
      expect(getByDeepText('username is a required field')).toBeInTheDocument();
      expect(getByDeepText('password is a required field')).toBeInTheDocument();
      expect(getByDeepText('email is a required field')).toBeInTheDocument();
      expect(getByDeepText('repeatPassword is a required field')).toBeInTheDocument();
    })
  })
});