import React, {useContext, useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Grid,
  LinearProgress,
  Snackbar,
  Theme,
  Typography
} from "@material-ui/core";
import {Alert} from "../components/Alert";
import {Field, Formik} from "formik";
import {RegisterSchema} from "../utils/validation_schemas/RegisterSchema";
import {TextField} from "formik-material-ui";
import {authService} from "../services/AuthService";
import {makeStyles} from "@material-ui/core/styles";
import {linkService} from "../services/LinkService";
import {UserContext, UserContextType} from "../contexts/UserContext";
import {ChangePasswordSchema} from "../utils/validation_schemas/ChangePasswordSchema";
import {monitorId, setMonitorId} from "../utils/jwtMonitor";
import {FeedbackContext} from "../contexts/FeedbackContext";

const useStyle = makeStyles((theme: Theme) => createStyles(
  {
    registerArea: {
      [theme.breakpoints.up("md")]: {
        width: "30%",
        margin: "auto",
        marginTop: "2%"
      },
      [theme.breakpoints.down("sm")]: {}
    },
    inputs: {},
    field: {
      width: '100%',
      margin: 10
    }
  }
))

export function ChangePassWordView() {
  const classes = useStyle();
  const history = useHistory();
  const feedback = useContext(FeedbackContext);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const {user, setUser} = useContext(UserContext) as UserContextType;
  if(!user) history.replace("/login");

  useEffect(() => {
    if (failed) {
      feedback.fail("用户未登录或提供错误的原密码！")
    }

  }, [failed]);

  useEffect(() => {
    if (success) {
      feedback.success("修改成功！")
      history.replace("/login");
    }
  }, [success]);

  return (
    <>
      <Card className={classes.registerArea}>
        <CardHeader
          title={<Typography variant={'h5'} align={"center"}>
            修改密码
          </Typography>}
          subheader={<Typography variant={"body1"} align={"center"}>
            可以在此处修改您的密码
          </Typography>}
        />
        <CardContent className={classes.inputs}>
          <Formik
            initialValues={{repeatNew: '', original: '', new: ''}}
            onSubmit={async values => {
              const {repeatNew, ...profile} = values;
              const result = await authService.changePassword(profile);
              if (result) {
                localStorage.removeItem('access_token'); // Clear accessToken stored.
                localStorage.removeItem('csrf_token'); // Clear csrfToken stored.
                if (monitorId) {
                  window.clearInterval(monitorId);
                  setMonitorId(0);
                }
                setSuccess(true);
              } else {
                setFailed(true);
              }
            }}
            validationSchema={ChangePasswordSchema}
          >
            {
              ({submitForm, isSubmitting, resetForm}) => {
                return (
                  <Grid
                    container xs={12}
                    direction={"row"}
                  >
                    {isSubmitting && <LinearProgress/>}
                    <Field disabled
                           name={'username'}
                           label={'用户名 : ' + user?.username}
                           placeholder={"请输入邮箱"}
                           variant={'outlined'}
                           component={TextField}
                           className={classes.field}
                    />
                    <Field
                      name={'original'}
                      label={'旧密码'}
                      placeholder={"请输入旧密码"}
                      variant={'outlined'}
                      component={TextField}
                      type={'password'}
                      className={classes.field}
                    />
                    <Field
                      name={'new'}
                      label={'新密码'}
                      placeholder={"请输入新密码"}
                      variant={'outlined'}
                      component={TextField}
                      type={'password'}
                      className={classes.field}
                    />
                    <Field
                      name={'repeatNew'}
                      label={'重复新密码'}
                      placeholder={"请确认新密码"}
                      variant={'outlined'}
                      component={TextField}
                      type={'password'}
                      className={classes.field}
                    />
                    <Grid item container direction={'row'} justify={"space-around"}>
                      <Button variant={'contained'} color={'primary'} onClick={() => submitForm()}>
                        修改
                      </Button>
                      <Button variant={'contained'} color={'secondary'} onClick={() => resetForm()}>
                        重置
                      </Button>
                    </Grid>
                  </Grid>
                )
              }
            }
          </Formik>
        </CardContent>
      </Card>
    </>
  )
}
