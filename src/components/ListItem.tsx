import React from "react";
import {ILink} from "../types/ILink";
import {Avatar, ListItem as LItem, ListItemAvatar, ListItemText,} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {linkService} from "../services/LinkService";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 100,
    },
    text: {
      marginLeft: 0,
      overflow: "hidden",
    },
  }),
);

export function ListItem(props: React.PropsWithoutRef<{ item: ILink }>) {
  const classes = useStyles();
  const {item} = props;

  return (
    <LItem key={item.id} className={classes.root}>
      <ListItemAvatar>
        <Avatar/>
      </ListItemAvatar>
      <ListItemText className={classes.text} primary={linkService.buildShortenLink(item.linkKey)}
                    secondary={item.href}/>
      <h6 style={{marginRight: 0, color: "grey"}}>创建时间: {item.createAt}</h6>
    </LItem>
  )
}
