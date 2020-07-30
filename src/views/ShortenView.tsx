import React, {useContext, useState} from 'react';
import {
  Button,
  Card,
  Container,
  CssBaseline,
  Grid,
  InputAdornment,
  makeStyles,
  TextField,
  Typography
} from '@material-ui/core';
import {Link} from '@material-ui/icons';
import {useHistory} from "react-router-dom";
import {linkService} from "../services/LinkService";
import {UserContext, UserContextType} from "../contexts/UserContext";

import '@testing-library/jest-dom';

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
  let history = useHistory();

  async function handleShorten() {
    // await setUser(null);
    // setUser({id: 1, username: 'string', email: "user@example.com"});
    if (user) {
      let resp = await linkService.post({user: user?.id, href: value});
      setShort('短链接 : ' + linkService.buildShortenLink(resp.linkKey));
      console.log(user);
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
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
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
                <Card id='shortText'>
                  {short}
                </Card>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
}
