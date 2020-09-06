import React, {useContext, useState} from 'react';
import {Button, Card, Container, Grid, InputAdornment, makeStyles, TextField, Typography} from '@material-ui/core';
import {Link} from '@material-ui/icons';
import {useHistory} from "react-router-dom";
import {linkService} from "../services/LinkService";
import {UserContext, UserContextType} from "../contexts/UserContext";
import '@testing-library/jest-dom';
import {FeedbackContext} from "../contexts/FeedbackContext";
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export function ShortenView() {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const [short, setShort] = useState('');
  const {user, setUser} = useContext(UserContext) as UserContextType;
  const feedback = useContext(FeedbackContext);
  let history = useHistory();

  const handleCopy = (e: ClipboardEvent) => {
    // clipboardData 可能是 null
    e.clipboardData && e.clipboardData.setData('text/plain', short.slice(6));
    e.preventDefault();
    // removeEventListener 要传入第二个参数
    document.removeEventListener('copy', handleCopy);
  };

  const Component = function () {
    if(short === '') return (<> </>);
    if(!user) {
      return (<>
        <Card
          id='shortText'
          style={{
            padding: 10
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Typography variant={"body1"} display='initial'>
                {short}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </>);
    }
    return (<>
      <Card
        id='shortText'
        style={{
          padding: 10
        }}
      >
        <Grid container>
          <Grid item xs={10}>
            <Typography variant={"body1"} display='initial'>
              {short}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={() => {
                document.addEventListener('copy', handleCopy);
                document.execCommand('copy');
                feedback.success("复制成功！")
              }}
              className={`verificationCode`}>
              点击复制
            </Button>
          </Grid>
        </Grid>
      </Card>
    </>)
  };

  async function handleShorten() {
    // await setUser(null);
    // setUser({id: 1, username: 'string', email: "user@example.com"});
    if (user) {
      let resp = await linkService.post({user: user?.id, href: value});
      setShort('短链接 : ' + linkService.buildShortenLink(resp.linkKey));
    } else {
      setShort('请先登录！');
    }
  }

  function handleShowAll() {
    if (user) {
      history.replace("/links");
    } else {
      setShort('请先登录！');
    }

  }

  return (
    <>
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            缩短链接
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              id='hrefField'
              value={value}
              onChange={(e) => setValue(e.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth
              label="原链接"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Link/>
                  </InputAdornment>
                ),
              }}
            />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button
                  id='shortenButton'
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={() => {
                    handleShorten()
                  }}
                >
                  生成短链接
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  id='showAllButton'
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.submit}
                  onClick={() => {
                    handleShowAll()
                  }}
                >
                  查看所有短链接
                </Button>
              </Grid>
              <Grid item xs={12}>
                {<Component />}
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
}
