import React, {useContext} from "react";
import {IRoute, IRouterProps} from "../types/IRouter";
import {Route, Switch,} from "react-router-dom";
import {RoutesContext} from "../contexts/RoutesContext";

function RecursiveRouter(props: React.PropsWithoutRef<{
  routes: IRoute[],
  prefix?: string
}>) {
  const prefix = props.prefix || '';
  return (
    <>
      <Switch>
        {
          props.routes.map(value => {
            const path = prefix + value.path;
            if (value.subRoutes) {
              return (<Route
                path={path}
                key={path}
              >
                <RecursiveRouter
                  routes={value.subRoutes}
                  prefix={prefix + value.path}
                />
              </Route>);
            } else {
              return (
                <Route
                  path={path}
                  key={path}
                >
                  {value.component}
                </Route>
              )
            }
          })
        }
      </Switch>
    </>
  )
}

export function Router(props: React.PropsWithoutRef<IRouterProps>) {
  const contextRoutes = useContext<IRoute[]>(RoutesContext);
  const routes = contextRoutes.length === 0 ? props.routes as IRoute[] : contextRoutes;
  return (
    <RoutesContext.Provider value={routes}>
      <RecursiveRouter routes={routes}/>
    </RoutesContext.Provider>
  )
}
