import React from "react";
import {IRoute, IRouterProps} from "../types/IRouter";
import {Route, Switch,} from "react-router-dom";
import {RoutesContext} from "../contexts/RoutesContext";
import {NavBar} from "../components/NavBar";

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
  return (
    <RoutesContext.Provider value={props.routes}>
      <NavBar/>
      <RecursiveRouter routes={props.routes}/>
    </RoutesContext.Provider>
  )
}
