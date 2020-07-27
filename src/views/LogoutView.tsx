import React, {useContext, useEffect} from "react";
import {UserContext, UserContextType} from "../contexts/UserContext";
import {authService} from "../services/AuthService";
import {CircularProgress} from "@material-ui/core";
import {useHistory} from "react-router-dom";

export function LogoutView() {
  const history = useHistory();
  const {setUser} = useContext(UserContext) as UserContextType;
  useEffect(() => {
    authService.logout().then(() => {
      setUser(null);
      history.replace('/');
    })
  }, []);
  return (
    <CircularProgress/>
  )
}