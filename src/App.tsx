import React, {useEffect, useState} from 'react';
import {Router} from "./router/Router";
import {routes} from './routes'
import {UserContext} from "./contexts/UserContext";
import {IUser} from "./types/IUser";
import {authService} from "./services/AuthService";
import {BrowserRouter} from 'react-router-dom';

function App() {
  const [user, setUser] = useState<IUser | null>(null);
  useEffect(() => {
    authService.ping().then(value => setUser(value));
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
