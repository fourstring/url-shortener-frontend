import React from "react";
import {IUserInfo} from "../types/IUserInfo";

export interface UserContextType {
  user: IUserInfo | null;
  setUser: any;
}

export const UserContext = React.createContext<UserContextType | null>(null);