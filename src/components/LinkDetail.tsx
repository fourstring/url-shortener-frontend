import React from "react";
import {ILink, ILinkInput} from "../types/ILink";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button,IconButton, Grid, Paper, Typography} from "@material-ui/core";
import {linkService} from "../services/LinkService";
import {CustomLink} from "./CustomLink";
import {MutateMethods, useEntity} from "../hooks/useEntity";
import {useHistory} from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(5),
      margin: 'auto',
      maxWidth: "50%",
      whiteSpace: "nowrap",
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)"
    },
    button: {
      margin: theme.spacing(1),
    }
  }),
);

export function LinkDetail(props: React.PropsWithoutRef<{ link: ILink }>) {
  const classes = useStyles();
  const history = useHistory();
  const {issueMutate} = useEntity<ILink, ILinkInput>(props.link.id, linkService);

  function handleDelete(linkId:number) {
    issueMutate({method: MutateMethods.DELETE, id: linkId});
    history.replace("/links");
  }

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h6">
                短链接：{props.link.linkKey}
              </Typography>
              <Typography variant="h6" gutterBottom>
                原链接：{props.link.href}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                创建时间：{props.link.createAt}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                创建时间：{props.link.updateAt}
              </Typography>
            </Grid>
            <Grid item>
                <Button id="delete" className={classes.button} variant="contained" color="secondary"
                        onClick={()=>handleDelete(props.link.id)}>
                  删除
                </Button>

              <CustomLink to={`/links`}>
              <Button id="return" className={classes.button} variant="contained" color="primary">
                返回</Button>
              </CustomLink>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>

  )

}
