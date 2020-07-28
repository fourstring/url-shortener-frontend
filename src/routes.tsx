import React from "react";
import {LinksView} from "./views/LinksView";
import {LinkDetailView} from "./views/LinkDetailView";
import {IRoute} from "./types/IRouter"

export const routes: IRoute[] = [
  {
    path: '/links',
    subRoutes: [
      {
        path: '/:id',
        component: <LinkDetailView/>,
        metadata: {
          displayText: '短链接',
        }
      },
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