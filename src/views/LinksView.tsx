import React from "react";
import {CircularProgress, createStyles, Divider, IconButton, List, makeStyles, Theme} from "@material-ui/core";
import {ListItem} from "../components/ListItem"
import {useEntities} from "../hooks/useEntities";
import {ILink, ILinkInput} from "../types/ILink";
import {linkService} from "../services/LinkService";
import {MutateMethods} from "../hooks/useEntity";
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import {CustomLink} from "../components/CustomLink";

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

  console.log(entities);

  function renderItems() {
    let items: JSX.Element[] = [];
    for (const [key, value] of entities.entries()) {
      items.push(
        <>
          <div className={classes.listItem}>
            <ListItem item={value}/>
            <CustomLink to={`/links/${value.id}`}>
              <IconButton id={value.id + "button"}>
                <SearchIcon/>
              </IconButton>
            </CustomLink>

            <IconButton style={{height: "50%", margin: "auto"}} id="delete"
                        color="secondary" onClick={() => handleDelete(value.id)}
            ><DeleteIcon/></IconButton>
          </div>
          <Divider variant="inset" component="li"/>
        </>
      );
    }
    return items;
  }

  function handleDelete(id: number): void {
    let tmp: number[] = []
    tmp[0] = id;
    issueMutate({method: MutateMethods.DELETE, ids: tmp});
  }

  // function testRenderItems() {
  //   let items: JSX.Element[] = [];
  //   for (let i = 0; i < link.length;i++) {
  //     items.push(
  //       <>
  //       <div className = {classes.listItem}>
  //         <ListItem item={link[i]}/>
  //         <CustomLink to={`/links/${link[i].id}`} >
  //           <IconButton className={classes.iconButton}><SearchIcon/></IconButton>
  //         </CustomLink>
  //         <IconButton style={{height:"50%", margin:"auto"}}
  //           color="secondary" onClick={()=>handleDelete(link[i].id)}
  //         ><DeleteIcon/></IconButton>
  //       </div>
  //         <Divider variant="inset" component="li"/>
  //       </>
  //     );
  //   }
  //   return items;
  // }

  return (
    <>
      <List dense className={classes.root}>
        {loading && <CircularProgress/>}
        {!loading && renderItems()}
        {/* {!loading && testRenderItems()} */}
      </List>
    </>
  );
}
