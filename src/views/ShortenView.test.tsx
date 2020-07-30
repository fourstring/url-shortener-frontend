import '@testing-library/jest-dom'
import React, {useState} from "react";
import {act, fireEvent, render, screen} from '@testing-library/react';
import {ShortenView} from "./ShortenView";
import {createMemoryHistory} from "history";
import {Router as BasicRouter} from "react-router";
import {UserContext} from "../contexts/UserContext";

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

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let setuser: any;
const mockHistoryReplace = jest.fn();
const history = createMemoryHistory({
  initialEntries: ['/'],
});
history.replace = mockHistoryReplace;

export function SetUp() {
  const [user, setUser] = useState();
  setuser = setUser;
  return (
    <UserContext.Provider value={{user, setUser}}>
      <BasicRouter history={history}>
        <ShortenView/>
      </BasicRouter>
    </UserContext.Provider>
  )
}


/*
* 测试生成按钮
* 检查登陆和未登录两种状态下的返回
* @author lzl
*/

describe('Test shorter button', () => {

  /*
  * 测试生成按钮
  * 检查未登录状态下是否返回一个"请先登录"提示
  * @author lzl
  */
  it("Test when not login", async () => {
    act(() => {
      render(<SetUp/>);
      setuser(null);
    })
    act(() => {
      fireEvent.click(getByDeepText('生成短链接'));
    })
    expect(getByDeepText('请先登录！')).toBeInTheDocument();
  });

  /*
  * 测试生成按钮
  * 检查登录状态下是否正常返回一个链接
  * @author lzl
  */
  it("Test when login", async () => {
    act(() => {
      const {getByLabelText} = render(<SetUp/>);
      fireEvent.change(getByLabelText("原链接"), {
        target: {value: 'test.com'}
      })
      setuser({id: 1, username: 'string', email: "user@example.com"});
    });
    act(() => {
      fireEvent.click(getByDeepText('生成短链接'));
    })
    await sleep(3000);
    expect(getByDeepText('短链接 : abcdefg.test.com')).toBeInTheDocument();


  });
});

/*
* 测试ShowAll按钮
* 检查登陆和未登录两种状态下的返回
* @author lzl
*/

describe('Test showAll button', () => {
  /*
  * 测试ShowAll按钮
  * 检查未登录状态下是否返回一个"请先登录"提示
  * @author lzl
  */
  it("Test when not login", async () => {
    act(() => {
      render(<SetUp/>);
      setuser(null);
    })
    act(() => {
      fireEvent.click(getByDeepText('查看所有短链接'));
    })
    expect(getByDeepText('请先登录！')).toBeInTheDocument();
  });

  /*
  * 测试ShowAll按钮
  * 检查登录状态下是否正常返回一个链接
  * @author lzl
  */
  it("Test when login", async () => {
    act(() => {
      render(<SetUp/>);
      setuser({id: 1, username: 'string', email: "user@example.com"});
    });
    act(() => {
      fireEvent.click(getByDeepText('查看所有短链接'));
    });
    await sleep(3000);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/links');
  });
});
