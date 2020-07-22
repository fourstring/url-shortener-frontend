import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import LoginView from "./views/LoginView";
import HomeView from "./views/HomeView";

export function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/login"}>
          <LoginView/>
        </Route>
        <Route path={"/"}>
          <HomeView/>
        </Route>
        <Route path={"/links"}>
          <HomeView/>
        </Route>
      </Switch>
    </BrowserRouter>
  )
}