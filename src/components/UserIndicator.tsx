import React, {useState} from "react";
import {IUser} from "../types/IUser";
import {Avatar, Button, Menu, MenuItem } from "@material-ui/core";
import {useHistory} from 'react-router-dom'

export function UserIndicator(props: React.PropsWithoutRef<{ user: IUser | null }>) {
  const [accountMenuOpen, setOpen] = useState(false);
  const history = useHistory();
  const indicatorRef = React.useRef<any>();

  const handleClose = () => {
    setOpen(false);
  }
  return (
    <>
      {props.user &&
      <>
        <Button onClick={() => setOpen(!accountMenuOpen)} ref={indicatorRef}>
          <Avatar>
            {props.user.username[0].toUpperCase()}
          </Avatar>
        </Button>
        <Menu
          id="menu-appbar"
          anchorEl={indicatorRef.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={accountMenuOpen}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => history.replace("/my")}
          >
            我的信息
          </MenuItem>
          <MenuItem
            onClick={() => history.replace("/logout")}
          >
            退出登陆
          </MenuItem>
        </Menu>
      </>
      }
    </>
  )
}
