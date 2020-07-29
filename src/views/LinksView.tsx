import React from "react";
import {Button, CircularProgress, createStyles, Divider, List, makeStyles, Theme} from "@material-ui/core";
import {ListItem} from "../components/ListItem"
import {useEntities} from "../hooks/useEntities";
import {ILink, ILinkInput} from "../types/ILink";
import {linkService} from "../services/LinkService";
import {MutateMethods} from "../hooks/useEntity";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 580,
      backgroundColor: theme.palette.background.paper,
      margin: 'auto'
    },
    loadingIndicator: {
      position: 'absolute', left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)'
    },
    item: {
      marginTop: 10,
      marginBottom: 10,
    },
    paper: {
      width: "100%",
      padding: 10
    },
    listItem: {
      display: "flex",
      margin: "auto"
    },
    iconButton: {
      marginTop: "50%"
    }
  })
);

export function LinksView() {
  const classes = useStyles();
  const {entities, loading, issueMutate} = useEntities<ILink, ILinkInput>(linkService);
  
  function renderItems() {
    let items: JSX.Element[] = [];
    for (const [key, value] of entities.entries()) {
      items.push(
        <div key={key}>
          <div className={classes.listItem}>
            <ListItem item={value}/>
            <Button style={{height: "50%", margin: "auto"}} id="delete"
                    color="secondary" onClick={() => handleDelete(value.id)}
            >删除</Button>
          </div>
          <Divider variant="inset" component="li"/>
        </div>
      );
    }
    return items;
  }

  function handleDelete(id: number): void {
    let tmp: number[] = [id];
    issueMutate({method: MutateMethods.DELETE, ids: tmp});
  }

  return (
    <>
      {loading && <CircularProgress className={classes.loadingIndicator}/>}
      {!loading && <List dense className={classes.root}>
        {renderItems()}
      </List>}
    </>
  );
}

