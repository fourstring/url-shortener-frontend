import React from "react";
import {Router as Rtr} from "./router/Router";
import {BrowserRouter, Router as BasicRouter, Switch} from "react-router-dom";
import {LinksView} from "./views/LinksView";
import {IRoute} from "./types/IRouter"
import {createMemoryHistory} from "history";

export function Router() {
  const routes: IRoute[] = [
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
  const history = createMemoryHistory({
    initialEntries: ['/links']
  });
  return (
    <BrowserRouter>
      <Switch>
        <BasicRouter history={history}>
          <Rtr routes={routes}/>
        </BasicRouter>
      </Switch>
    </BrowserRouter>
  )
}