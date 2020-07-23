import React from "react";
import {useCheckboxes} from "../hooks/useCheckboxes";
import {MutateMethods} from "../hooks/useEntity";
import {CircularProgress, createStyles, Divider, Grid, List, makeStyles, Theme} from "@material-ui/core";
import {link} from "../mocks/mockDb";
import {useEntities} from "../hooks/useEntities";
import {ILink, ILinkInput} from "../types/ILink";
import {linkService} from "../services/LinkService";
import {ListItem} from "../components/ListItem"

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
  const {selected, checkboxes, select, clear} = useCheckboxes([...entities.values()]);


  function handleDelete() {
    issueMutate({method: MutateMethods.DELETE, ids: selected});
    clear();
  }


  return (
    <>
      {loading && <Grid container justify={"center"} className={classes.loadingIndicator}>
        <CircularProgress/>
      </Grid>}
      <List dense className={classes.root}>
        {(() => {
          let result = [];
          for (let i = 0; i < link.length; i++) {
            result.push(
              <>
                <ListItem item={link[i]}/>
                <Divider variant="inset" component="li"/>
              </>
            )
          }
          return result;
        })()
        }
      </List>
    </>
  );
}