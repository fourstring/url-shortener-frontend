import React, {useContext, useState} from "react";
import {ILink} from "../types/ILink";
import {Card, CardActions, CardContent, Button, Typography} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {linkService} from "../services/LinkService";
import {FeedbackContext} from "../contexts/FeedbackContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 140,
      width: '100%',
    },
    text: {
      marginLeft: 0,
      overflow: "hidden",
    },
  }),
);

export function CardItem(props: React.PropsWithoutRef<{ item: ILink }>) {
  const classes = useStyles();
  const {item} = props;
  const [short, setShort] = useState('');
  const feedback = useContext(FeedbackContext);
  let tmp:string = "0";
  const handleCopy = (e: ClipboardEvent) => {
    // clipboardData 可能是 null
    e.clipboardData && e.clipboardData.setData('text/plain', tmp);
    e.preventDefault();
    // removeEventListener 要传入第二个参数
    document.removeEventListener('copy', handleCopy);
  };

  return (
    <Card key={item.id} className={classes.root}>
      <CardContent>
              <Typography variant="h6" component="h2">
              短链接: {linkService.buildShortenLink(item.linkKey)}
              </Typography>
              <Typography variant="body2" style={{marginTop:5}}>
              长链接: {item.linkKey}
              </Typography>
              <Button style={{marginTop:20}} variant="contained" color="primary" size="small"
              onClick={() => {
                tmp = linkService.buildShortenLink(item.linkKey)
                document.addEventListener('copy', handleCopy);
                document.execCommand('copy');
                feedback.success("复制成功！")
              }}
              className={`verificationCode`}>
              复制短链接
            </Button>
            <Button style={{marginTop:20, marginLeft: 10}} variant="contained" color="primary" size="small"
              onClick={() => {
                tmp = item.linkKey
                document.addEventListener('copy', handleCopy);
                document.execCommand('copy');
                feedback.success("复制成功！")
              }}
              className={`verificationCode`}>
              复制长链接
            </Button>
        </CardContent>
      {/* <ListItemText className={classes.text} primary={linkService.buildShortenLink(item.linkKey)}
                    secondary={item.href}/> */}
      {/*<h6 style={{marginRight: 0, color: "grey"}}>创建时间: {item.createAt}</h6>*/}
    </Card>
  )
}
