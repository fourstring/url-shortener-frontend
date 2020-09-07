import React, {useContext, useMemo} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {AppBar, Tab, Tabs, Toolbar, Typography} from '@material-ui/core';
import {useMetadataMap} from "../hooks/useMetadataMap";
import {IRouteMetadata} from "../types/IRouter";
import {Link, useLocation} from "react-router-dom";
import {UserContext, UserContextType} from "../contexts/UserContext";
import {UserIndicator} from "./UserIndicator";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export interface TabData {
  path: string,
  displayText: string,
  displayIcon?: React.ReactNode;
}

function props(index: number) {
  return {
    key: `${index}`,
    id: `tab-${index}`,
  };
}

export function NavBar() {
  const classes = useStyles();
  const location = useLocation();
  const {user} = useContext(UserContext) as UserContextType;
  const metadataMap: Map<string, IRouteMetadata> = useMetadataMap();
  const displayList = useMemo<TabData[]>(() => {
    const list: TabData[] = new Array<TabData>();
    const filter = (value: IRouteMetadata) => {
      if (value.anonymousOnly) {
        if (user) return false;
      }
      if (value.authenticatedOnly) {
        if (!user) return false;
      }
      if (value.adminOnly) {
        return user?.admin;
      }
      return true;
    };
    metadataMap.forEach((value, path) => {
      if (value.display && value.displayText && filter(value)) {
        list.push({
          path,
          displayText: value.displayText,
          displayIcon: value.displayIcon
        });
      }
    })
    return list;
  }, [user, metadataMap]);

  const pathToIndexMap = useMemo<Map<string, number>>(() => {
    let map = new Map<string, number>();
    displayList.forEach((data: TabData, index: number) => {
      map.set(data.path, index);
    });
    return map;
  }, [displayList]);
  console.log(location.pathname);
  let value = pathToIndexMap.get(location.pathname);

  return (value === undefined ? null :
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              短链接生成器
            </Typography>
            <Tabs value={value} aria-label="bar-tabs">
              {displayList.map((data, index) => (
                <Tab
                  to={data.path}
                  component={Link}
                  label={data.displayText}
                  {...props(index)}
                />
              ))}
            </Tabs>
            {user && <UserIndicator user={user}/>}
          </Toolbar>
        </AppBar>
      </div>
  );
}
