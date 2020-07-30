import React, {useEffect, useState} from 'react';
import {Router} from "./router/Router";
import {routes} from './routes'
import {UserContext} from "./contexts/UserContext";
import {IUser} from "./types/IUser";
import {BrowserRouter} from 'react-router-dom';
import config from "./config";
let {jwtMonitor, monitorId, setMonitorId} = require('./utils/jwtMonitor')
let jwt = require('jsonwebtoken');

function App() {
  const [user, setUser] = useState<IUser | null>(null);
  useEffect(() => {
    (async function f() {
      const token = await jwtMonitor();
      console.log(token)
      if(token){
        let decode = jwt.decode(token);
        setUser({
          id: decode.user_id,
          username: decode.username,
          email: decode.email,
        })
        setMonitorId(window.setInterval(jwtMonitor, config.jwtMonitorRate, () => {
          // @ts-ignore
          UserContext.setUser(null);
          window.clearInterval(monitorId);
          setMonitorId(0);
        }));
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      <BrowserRouter>
        <Router routes={routes}/>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;
