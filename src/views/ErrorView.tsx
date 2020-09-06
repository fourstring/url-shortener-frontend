import React from 'react';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useRouteMetadata} from "../hooks/useRouteMetadata";
import {Card} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import BlockIcon from '@material-ui/icons/Block';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { red, yellow } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
      title:{
          fontFamily: 'Microsoft YaHei',
          fontSize:30,
          textAlign:'center',
           height: 80,
           display:'flex',
           width:'50%',
           margin:'auto'
      },
      icon:{
        fontSize: 40, 
        height:'auto', 
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
        <Card className={classes.title} style={{alignItems:'center', justifyContent:'center', width:'30%'}}>
            <SearchIcon className = {classes.icon} style={{color: red[500], marginRight:15}}/>
            <div>短链接不存在</div>
        </Card>
        }

        {metadata.displayText === '短链接已被禁用' && 
        <Card className={classes.title} style={{alignItems:'center', justifyContent:'center', width:'30%'}}>
            <BlockIcon className = {classes.icon} style={{color: red[500], marginRight:15}}/>
            该短链接已被禁用
        </Card>
        }

        {metadata.displayText === '系统故障' && 

        <Card className={classes.title} style={{alignItems:'center', justifyContent:'center', width:'50%'}}>
            <ErrorOutlineIcon className = {classes.icon} style={{color: yellow[500], marginRight:15}}/>
            系统故障，请您稍后尝试刷新页面
        </Card>
        }
        </div>
    );
}