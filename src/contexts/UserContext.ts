import React from "react";
import {IUser} from "../types/IUser";

export interface UserContextType {
  user: IUser | null;
  setUser: any;
}

export const UserContext = React.createContext<UserContextType | null>(null);

