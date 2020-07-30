import {IRoute} from "./types/IRouter";
import {ShortenView} from './views/ShortenView'
import React from "react";
import {LinksView} from "./views/LinksView";
import {LoginView} from "./views/LoginView";
import {LogoutView} from "./views/LogoutView";
import {RegisterView} from "./views/RegisterView";

export const routes: IRoute[] = [
  {
    path: '/shorten',
    component: <ShortenView/>,
    metadata: {
      displayText: "缩短链接"
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
        }
      }
    ]
  },
  {
    path: '/login',
    component: <LoginView/>,
    metadata: {
      displayText: "登录"
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
      displayText: "注册"
    }
  },
  {
    path: '/',
    component: <ShortenView/>,
    metadata: {
      displayText: "缩短链接"
    }
  }
];
