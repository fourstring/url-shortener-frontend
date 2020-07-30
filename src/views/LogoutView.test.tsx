import {renderHook} from "@testing-library/react-hooks";
import React, {useState} from "react";
import {IUser} from "../types/IUser";
import {createMemoryHistory} from "history";
import {render, waitFor} from "@testing-library/react";
import {UserContext} from "../contexts/UserContext";
import {Router as BasicRouter} from "react-router";
import {LogoutView} from "./LogoutView";
import {authService} from "../services/AuthService";
import {testAdapter, testClient } from "../mocks/testClient";

authService.client = testClient;

/*
* 检测 LogoutView
* LogoutView 是否退出登陆并返回主页
* @author wfn
*/
it('LogoutView test', async () => {
  const {result} = renderHook(() => useState<IUser | null>(null))
  const [user, setUser] = result.current
  testAdapter.onGet('/auth/logout').reply(config => {
    return [200]
  });
  const history = createMemoryHistory({
    initialEntries: ['/logout']
  })
  render(<UserContext.Provider value={{user, setUser}}>
    <BasicRouter history={history}>
      <LogoutView/>
    </BasicRouter>
  </UserContext.Provider>)
  await waitFor(() => {});
  expect(history.location.pathname).toBe('/');
});