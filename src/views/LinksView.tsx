import React, {useContext} from "react";
import {Button, CircularProgress, createStyles, Divider, Grid, makeStyles, Paper, Theme} from "@material-ui/core";
import {CardItem} from "../components/CardItem"
import {useEntities} from "../hooks/useEntities";
import {ILink, ILinkInput} from "../types/ILink";
import {linkService} from "../services/LinkService";
import {MutateMethods} from "../hooks/useEntity";
import {PagedView} from "../utils/PagedView";

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
    position: "relative",
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

  function handleDelete(id: number): void {
    let tmp: number[] = [id];
    issueMutate({method: MutateMethods.DELETE, ids: tmp});
  }

  return (
    <>
      {loading && <CircularProgress className={classes.loadingIndicator}/>}
      {!loading &&
      <PagedView<ILink, ILinkInput> dataSource={linkService} filter={{
        filters: null
      }}>{(data, paginator) => {
        let list: JSX.Element[] = [];
        data.forEach((value, key) => list.push(
          <Grid item xs={12} key={key}>
            <div style={{margin: 'auto', width: '50%', height: 500, marginTop: 20}}>
              <div className={classes.listItem}>
                <CardItem item={value}/>
                <Button style={{position: "absolute", right: 50, top: 40}} id="delete"
                        color="secondary" variant="contained" onClick={() => handleDelete(value.id)}
                >删除</Button>
              </div>
              <Divider variant="inset" component="li"/>
            </div>
          </Grid>));
        return (
          <>
            <Grid container>
              {list.length === 0 ?
                <Paper className={classes.text}>
                  <h3 style={{margin: "auto"}}>您的短链接列表为空</h3>
                </Paper> : list}
              <Grid item xs={7} container direction={"row-reverse"}>
                {paginator}
              </Grid>
            </Grid>
          </>
        )
      }}
      </PagedView>
      }
    </>
  );
}

