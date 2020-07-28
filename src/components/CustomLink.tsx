import {createStyles, Theme} from "@material-ui/core";
import {Link, LinkProps} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
  link: {
    textDecoration: "none",
    "&:visited": {
      color: theme.palette.text.primary
    },
    color: theme.palette.text.primary
  }
}));

export function CustomLink(props: LinkProps) {
  const classes = useStyles();
  return (
    <Link {...props} className={classes.link}/>
  )
}
