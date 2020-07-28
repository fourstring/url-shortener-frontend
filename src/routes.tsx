import React from "react";
import {LinksView} from "./views/LinksView";
import {IRoute} from "./types/IRouter"

export const routes: IRoute[] = [
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
  }
];