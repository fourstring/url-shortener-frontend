import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useRouteMetadata} from "../hooks/useRouteMetadata";
import {Card, Typography} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import BlockIcon from '@material-ui/icons/Block';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { red, yellow } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
      title:{
          fontFamily: 'Microsoft YaHei',
          textAlign:'center',
           height: 190,
           width:'50%',
           margin:'auto',
      },
      icon:{
        fontSize: 75, 
        height:'80', 
      }
  })
);

export function ErrorView(){
    const classes = useStyles();
    const metadata = useRouteMetadata();
    console.log(metadata.displayText);
    

    return(
        <div style={{marginTop:'20%'}}>
        {metadata.displayText === '短链接不存在' && 
        <Card className={classes.title} style={{ width:'30%'}}>
            <SearchIcon className = {classes.icon} style={{color: red[500], margin:'auto',marginTop:10}}/>
            <Typography variant='h2'>短链接不存在</Typography>
        </Card>
        }

        {metadata.displayText === '短链接已被禁用' && 
        <Card className={classes.title} style={{alignItems:'center', justifyContent:'center', width:'40%'}}>
            <BlockIcon className = {classes.icon} style={{color: red[500], margin:'auto',marginTop:10}}/>
            <Typography variant='h2'>该短链接已被禁用</Typography>
        </Card>
        }

        {metadata.displayText === '系统故障' && 

        <Card className={classes.title} style={{alignItems:'center', justifyContent:'center', width:'65%'}}>
            <ErrorOutlineIcon className = {classes.icon} style={{color: yellow[500],margin:'auto',marginTop:10}}/>
            <Typography variant='h2'>系统故障，请您稍后尝试刷新页面</Typography>
        </Card>
        }
        </div>
    );
}