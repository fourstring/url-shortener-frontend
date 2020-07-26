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
    component: <ShortenView/>,
    metadata: {
      displayText: "所有链接"
    }
  }
];
