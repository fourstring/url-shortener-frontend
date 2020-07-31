import React, {useContext} from 'react';
import {useHistory, useLocation} from "react-router-dom";
import {IAuthRedirectState} from "../types/IAuth";
import {Field, Form, Formik} from "formik";
import {UserContext, UserContextType} from "../contexts/UserContext";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button, Card, CardActions, CardContent, CardHeader, Grid, LinearProgress, Typography} from "@material-ui/core";
import {TextField} from "formik-material-ui";
import {LoginSchema} from "../utils/validation_schemas/LoginSchema";
import {authService} from "../services/AuthService";
import config from "../config";
import {jwtMonitor, monitorId, setMonitorId} from "../utils/jwtMonitor";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginArea: {
      [theme.breakpoints.up("md")]: {
        width: "30%",
        margin: "auto",
        marginTop: "2%"
      },
      [theme.breakpoints.down("sm")]: {}
    },
    inputs: {
      padding: 12
    },
    inputField: {
      width: "100%"
    },
    actions: {
      padding: 12,
      space: 2
    }
  })
);

export function LoginView() {
  const classes = useStyles();
  const {setUser} = useContext(UserContext) as UserContextType; // UserContext is provided in App.tsx as an UserContextType object.
  const history = useHistory();
  const location = useLocation<IAuthRedirectState | null>();
  const {from} = location.state || {from: {pathname: "/"}};

  return (
    <>
      <Card className={classes.loginArea}>
        <CardHeader
          title={<Typography variant={"h5"} align={"center"}>
            短链接
          </Typography>}
          subheader={<Typography variant={"body1"} align={"center"}>
            登陆后使用更多功能
          </Typography>}
        />
        <Formik
          initialValues={{
            username: "",
            password: ""
          }}
          onSubmit={async (values) => {
            const user = await authService.login(values);
            // setup interval execute of jwtMonitor
            setMonitorId(window.setInterval(jwtMonitor, config.jwtMonitorRate, () => {
              setUser(null);
              window.clearInterval(monitorId);
              setMonitorId(0);
            }));
            setUser(user);
            history.replace(from.pathname as string);
          }}
          validationSchema={LoginSchema}
        >
          {({submitForm, isSubmitting}) => {
            return (
              <Form>
                <CardContent>
                  {isSubmitting && <LinearProgress/>}
                  <Grid container className={classes.inputs} spacing={3}>
                    <Grid item xs={12}>
                      <Field
                        name={"username"}
                        label={"用户名"}
                        variant="outlined"
                        component={TextField}
                        placeholder={"请输入用户名"}
                        className={classes.inputField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name={"password"}
                        label={"密码"}
                        variant="outlined"
                        type={"password"}
                        component={TextField}
                        placeholder={"请输入密码"}
                        className={classes.inputField}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Grid
                    container
                    justify={"space-around"}
                    className={classes.actions}
                  >
                    <Grid item>
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        onClick={submitForm}
                        disabled={isSubmitting}
                      >
                        登陆
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={()=>{history.replace('/register')}}
                        variant={"contained"}
                      >
                        注册
                      </Button>
                    </Grid>
                  </Grid>
                </CardActions>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </>
  );
}
