import {IRoute} from "./types/IRouter";
import {ShortenView} from './views/ShortenView'
import React from "react";
import {LinksView} from "./views/LinksView";
import {LoginView} from "./views/LoginView";
import {LogoutView} from "./views/LogoutView";
import {RegisterView} from "./views/RegisterView";
import {Redirect} from "react-router-dom";
import {AnalysisView} from "./views/admin/AnalysisView";
import {StatisticView} from "./views/admin/StatisticView";

export const routes: IRoute[] = [
  {
    path: '/admin',
    subRoutes: [
      {
        path: '/analysis',
        component: <AnalysisView/>,
        metadata: {
          displayText: "数据分析",
          display: true,
          adminOnly: true
        }
      },
      {
        path: '/statistic',
        component: <StatisticView/>,
        metadata: {
          displayText: "访问统计",
          display: true,
          adminOnly: true
        }
      }
    ]
  },
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
    path: '/',
    component: <Redirect to={'/shorten'}/>,
    metadata: {
      displayText: "缩短链接",
    }
  }
];
