import {IRoute} from "../types/IRouter";
import React from "react";

export const RoutesContext = React.createContext<IRoute[]>([]);
