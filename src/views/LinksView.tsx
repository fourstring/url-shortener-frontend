import React from "react";
import { 
  createStyles, 
  makeStyles, 
  Theme,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemAvatar,
  Checkbox,
  Avatar,
  CircularProgress,
  Grid,
  Divider
} from "@material-ui/core";
import {link} from "../mocks/mockDb";
import {useEntities} from "../hooks/useEntities";
import {ILink, ILinkInput} from "../types/ILink";
import {linkService} from "../services/LinkService"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 500,
      backgroundColor: theme.palette.background.paper,
      position: 'absolute', left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)'
    },
    loadingIndicator: {
      marginTop: 40
    },
  })
);

export function LinksView() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([1]);
  const {entities, loading, error, issueMutate} = useEntities<ILink, ILinkInput>(linkService);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };


  return (
    <>
    {loading && <Grid container justify={"center"} className={classes.loadingIndicator}>
        <CircularProgress/>
      </Grid>}
    <List dense className={classes.root}>
      {(() =>{
        let result = [];
        for( let i = 0 ; i< link.length; i++){
          result.push(
            <>
          <ListItem key={link[i].id} style={{height:120}}>
            <ListItemAvatar>
              <Avatar
                alt={`Avatar n°${i + 1}`}
                src={`/static/images/avatar/${i + 1}.jpg`}
              />
            </ListItemAvatar>
            <ListItemText id={`${i}`} style={{marginLeft:0}} primary={link[i].linkKey} secondary={link[i].href}/>
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onChange={handleToggle(i)}
                checked={checked.indexOf(i) !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
          </>
          )}
        return result;
      })()
      }
    </List>
    </>
  );
}