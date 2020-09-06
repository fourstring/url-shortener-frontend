import {IRoute} from "./types/IRouter";
import {ShortenView} from './views/ShortenView'
import React from "react";
import {LinksView} from "./views/LinksView";
import {LoginView} from "./views/LoginView";
import {LogoutView} from "./views/LogoutView";
import {RegisterView} from "./views/RegisterView";
import {ErrorView} from "./views/ErrorView"
import {Redirect} from "react-router-dom";

export const routes: IRoute[] = [
  
  {
    path: '/shorten',
    component: <ShortenView/>,
    metadata: {
      displayText: "缩短链接",
      display: true
    }
  },

  {
    path: '/links',
    subRoutes: [
      {
        path: '',
        component: <LinksView/>,
        metadata: {
          displayText: '我的短链接',
          display: true
        }
      }
    ]
  },
  {
    path: '/login',
    component: <LoginView/>,
    metadata: {
      displayText: "登录",
      display: true,
      anonymousOnly: true
    }
  },
  {
    path: '/logout',
    component: <LogoutView/>,
    metadata: {
      displayText: "登出"
    }
  },
  {
    path: '/register',
    component: <RegisterView/>,
    metadata: {
      displayText: "注册",
      display: true,
      anonymousOnly: true
    }
  },
  {
    path: '/notfound',
    component: <ErrorView/>,
    metadata: {
      displayText: "短链接不存在",
    }
  },
  {
    path: '/disabled',
    component: <ErrorView/>,
    metadata: {
      displayText: "短链接已被禁用",
    }
  },
  {
    path: '/error',
    component: <ErrorView/>,
    metadata: {
      displayText: "系统故障",
    }
  },
  {
    path: '/',
    component: <Redirect to={'/shorten'}/>,
    metadata: {
      displayText: "缩短链接",
    }
  },
];
