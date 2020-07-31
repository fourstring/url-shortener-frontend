import React, {useState} from "react";
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

export function RegisterView() {
  const classes = useStyle();
  const history = useHistory();
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  function handleToLogin() {
    history.replace('/login');
  }

  return (
    <>
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity={"success"} action={
          <Button variant={"contained"} color={"primary"} onClick={handleToLogin}>
            登陆
          </Button>}>
          注册成功！
        </Alert>
      </Snackbar>
      <Snackbar open={failed} autoHideDuration={3000} onClose={() => setFailed(false)}>
        <Alert severity={"error"}>
          注册出现问题！请联系管理员。
        </Alert>
      </Snackbar>
      <Card className={classes.registerArea}>
        <CardHeader
          title={<Typography variant={'h5'} align={"center"}>
            短链接
          </Typography>}
          subheader={<Typography variant={"body1"} align={"center"}>
            注册后使用更多功能
          </Typography>}
        />
        <CardContent className={classes.inputs}>
          <Formik
            initialValues={{email: '', username: '', password: '', repeatPassword: ''}}
            onSubmit={async values => {
              const {repeatPassword, ...profile} = values;
              const result = await authService.register(profile);
              if (result) {
                setSuccess(true);
              } else {
                setFailed(true);
              }
            }}
            validationSchema={RegisterSchema}
          >
            {
              ({submitForm, isSubmitting, resetForm}) => {
                return (
                  <Grid
                    container xs={12}
                    direction={"row"}
                  >
                    {isSubmitting && <LinearProgress/>}
                    <Field
                      name={'email'}
                      label={'邮箱'}
                      placeholder={"请输入邮箱"}
                      variant={'outlined'}
                      component={TextField}
                      className={classes.field}
                    />
                    <Field
                      name={'username'}
                      label={'用户名'}
                      placeholder={"请输入用户名"}
                      variant={'outlined'}
                      component={TextField}
                      validate={
                        async (username: string) => {
                          let error: string = '';
                          const result = await authService.checkExists(username);
                          if (!result) {
                            error = '用户名重复！'
                          }
                          return error;
                        }
                      }
                      className={classes.field}
                    />
                    <Field
                      name={'password'}
                      label={'密码'}
                      placeholder={"请输入密码"}
                      variant={'outlined'}
                      component={TextField}
                      type={'password'}
                      className={classes.field}
                    />
                    <Field
                      name={'repeatPassword'}
                      label={'重复密码'}
                      placeholder={"请确认密码"}
                      variant={'outlined'}
                      component={TextField}
                      type={'password'}
                      className={classes.field}
                    />
                    <Grid item container direction={'row'} justify={"space-around"}>
                      <Button variant={'contained'} color={'primary'} onClick={() => submitForm()}>
                        注册
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
