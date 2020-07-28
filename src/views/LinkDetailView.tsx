import React from "react";
import {useParams} from "react-router-dom"
import {ILink, ILinkInput} from "../types/ILink"
import {useEntity} from "../hooks/useEntity";
import {CircularProgress, createStyles, makeStyles, Theme} from "@material-ui/core";
import {linkService} from "../services/LinkService";
import {LinkDetail} from "../components/LinkDetail";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loadingIndicator: {
      position: 'absolute', left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)'
    },
  })
);

export function LinkDetailView() {
  const classes = useStyles();
  const {id} = useParams();
  console.log("id: ", id);
  const {data, loading} = useEntity<ILink, ILinkInput>(parseInt(id as string), linkService);
  console.log("data: ", data);
  return (
    <>
      {loading && <CircularProgress className={classes.loadingIndicator}/>}
      {!loading && <LinkDetail link={data as ILink}/>}
      {/* {!loading && <LinkDetail link={link[id - 1] as ILink}/>} */}
      {/* <LinkDetail link={data as ILink}/> */}
    </>
  )
}