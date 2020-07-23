<<<<<<< HEAD
import React from "react";
import {IUser} from "../types/IUser";

export interface UserContextType {
    user: IUser | null;
    setUser: any;
}

=======
import React from "react";
import {IUser} from "../types/IUser";

export interface UserContextType {
    user: IUser | null;
    setUser: any;
}

>>>>>>> dev
export const UserContext = React.createContext<UserContextType | null>(null);