import React, {useContext} from "react";
import {Button, CircularProgress, createStyles, Divider, List, makeStyles, Paper, Theme} from "@material-ui/core";
import {CardItem} from "../components/CardItem"
import {useEntities} from "../hooks/useEntities";
import {ILink, ILinkInput} from "../types/ILink";
import {linkService} from "../services/LinkService";
import {MutateMethods} from "../hooks/useEntity";
import {UserContext, UserContextType} from "../contexts/UserContext";

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    width: "100%",
    maxWidth: 580,
    backgroundColor: 'black',//theme.palette.background.paper,
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
    position:"relative",
    margin: "auto"
  },
  iconButton: {
    marginTop: "50%"
  },
  text: {
    position: 'absolute', left: '50%', top: '50%',
    transform: 'translate(-50%, -50%)',
    color: "grey",
    width: "20%",
    height: "30%",
    display: "flex",
    justifyContent: "center"
  },
}));

export function LinksView() {
  const classes = useStyles();
  const {entities, loading, error, issueMutate} = useEntities<ILink, ILinkInput>(linkService);
 const {user} = useContext(UserContext) as UserContextType;

  function renderItems() {
    let items: JSX.Element[] = [];
    
    for (const [key, value] of entities.entries()) {
      items.push(
        <div key={key} style={{margin:'auto', width:'50%', height:500, marginTop:20}}>
          <div className={classes.listItem}>
            <CardItem item={value}/>
            <Button style={{position:"absolute", right:50, top:40}} id="delete"
                    color="secondary" variant="contained"  onClick={() => handleDelete(value.id)}
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

  let items = renderItems();

  return (
    <>
      {loading && <CircularProgress className={classes.loadingIndicator}/>}
      {!loading && 
          items.length === 0 ?
            <Paper className={classes.text}>
              <h3 style={{margin: "auto"}}>您的短链接列表为空</h3>
            </Paper> : items
      }
    </>
  );
}

