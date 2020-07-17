import React, {useEffect, useState} from 'react';
import {Router} from "./router";
import {UserContext} from "./contexts/UserContext";
import {IUser} from "./types/IUser";
import {authService} from "./services/AuthService";

function App() {
    const [user, setUser] = useState<IUser | null>(null);
    useEffect(() => {
        authService.ping().then(value => setUser(value.user));
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            <Router/>
        </UserContext.Provider>
    )
}

export default App;
