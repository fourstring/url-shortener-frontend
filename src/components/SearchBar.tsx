import React from "react";
import {createStyles, InputBase, Paper, Theme} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: "flex",
    height: 50,
    alignItems: "center"
  },
  searchIcon: {
    margin: 10
  },
  inputBar: {
    width: "100%"
  }
}));

export function SearchBar(props: React.PropsWithRef<{ onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => any, searchText: string, value?: string }>) {
  const classes = useStyles();
  return (
    <Paper elevation={3} className={classes.root}>
      <SearchIcon className={classes.searchIcon}/>
      <InputBase
        onChange={props.onChange}
        inputProps={{"aria-label": `搜索${props.searchText}`}}
        placeholder={`搜索${props.searchText}...`}
        className={classes.inputBar}
        value={props.value}
      />
    </Paper>
  )
}