import '@testing-library/jest-dom/extend-expect'
import React, {useState} from 'react'
import {ErrorView} from "./ErrorView"
import {act, fireEvent, render, waitFor} from '@testing-library/react'
import {Router as BasicRouter} from "react-router-dom";
import {Router} from '../router/Router'
import {createMemoryHistory, MemoryHistory} from 'history'
import {IRoute} from "../types/IRouter";
import {getByDeepText} from "../utils/getByDeepText";
import {UserContext} from "../contexts/UserContext";
import {IUser} from "../types/IUser";
import {testUser} from "../mocks/testData"

const routes: IRoute[] = [
    {
      path: '/notfound',
      component: <ErrorView/>,
      metadata: {
        displayText: '短链接不存在',
      }
    },
    {
      path: '/error',
      component: <ErrorView/>,
      metadata: {
        displayText: '系统故障'
      }
    },
    {
      path: '/disabled',
      component: <ErrorView/>,
      metadata: {
        displayText: '短链接已被禁用',
      }
    }
  ]
/*
* 检测 ErrorView 显示情况
* @author ydx
*/
describe("Test ErrorView",()=>{
    it('should render not found view correctly', ()=>{
        const history = createMemoryHistory({
            initialEntries: ['/notfound']
          });
          const {getByText} = render(
              <BasicRouter history = {history}>
                  <Router routes = {routes}/>
              </BasicRouter>
          )
          expect(getByText("短链接不存在")).toBeInTheDocument();
    });it('should render disabled view correctly', ()=>{
        const history = createMemoryHistory({
            initialEntries: ['/disabled']
          });
          const {getByText} = render(
              <BasicRouter history = {history}>
                  <Router routes = {routes}/>
              </BasicRouter>
          )
          expect(getByText("该短链接已被禁用")).toBeInTheDocument();
    });
it('should render error view correctly', ()=>{
    const history = createMemoryHistory({
        initialEntries: ['/error']
      });
      const {getByText} = render(
          <BasicRouter history = {history}>
              <Router routes = {routes}/>
          </BasicRouter>
      )
      expect(getByText("系统故障，请您稍后尝试刷新页面")).toBeInTheDocument();
});


})
