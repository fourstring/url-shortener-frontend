import React, {useEffect, useState} from 'react';
import {Router} from "./router/Router";
import {routes} from './routes'
import {UserContext} from "./contexts/UserContext";
import {IUser} from "./types/IUser";
import {BrowserRouter} from 'react-router-dom';
import config from "./config";
import {CssBaseline} from "@material-ui/core";
import {NavBar} from "./components/NavBar";
import {RoutesContext} from "./contexts/RoutesContext";
import {useSnackbarFeedback} from "./hooks/useSnackbarFeedback";
import {FeedbackContext} from "./contexts/FeedbackContext";

let {jwtMonitor, monitorId, setMonitorId} = require('./utils/jwtMonitor')
let jwt = require('jsonwebtoken');

function App() {
  const [user, setUser] = useState<IUser | null>(null);
  const feedback = useSnackbarFeedback();
  useEffect(() => {
    (async function f() {
      const token = await jwtMonitor();
      console.log(token)
      if (token) {
        let decode = jwt.decode(token);
        setUser({
          id: decode.user_id,
          username: decode.username,
          email: decode.email,
          admin: decode.admin,
        })
        setMonitorId(setInterval(jwtMonitor, config.jwtMonitorRate, () => {
          setUser(null);
          clearInterval(monitorId);
          setMonitorId(0);
        }));
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      <BrowserRouter>
        <RoutesContext.Provider value={routes}>
          <FeedbackContext.Provider value={feedback}>
            <CssBaseline/>
            {feedback.successBar}
            {feedback.failBar}
            <NavBar/>
            <Router/>
          </FeedbackContext.Provider>
        </RoutesContext.Provider>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;
