import {IRoute} from "./types/IRouter";
import {ShortenView} from './views/ShortenView'
import React from "react";

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
    component: <ShortenView/>,
    metadata: {
      displayText: "登录"
    }
  }
];
