import React from "react";
import {useSnackbarFeedback} from "../../hooks/useSnackbarFeedback";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {
  DialogTitle,
  Dialog,
  Typography,
  DialogContent,
  LinearProgress,
  Grid, DialogActions, Button,
} from "@material-ui/core";
import {Field, Formik} from "formik";
import {adminService} from "../../services/AdminService";
import {NewBookSchema} from "../../utils/validation_schemas/NewLinkSchema";
import {TextField} from "formik-material-ui";

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    padding: 30
  },
  field: {
    marginTop: 10,
    marginBottom: 10
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}))

export function AddLinkDialog(props: React.PropsWithRef<{
  open: boolean,
  onClose: () => void
}>) {
  const {success, successBar, fail, failBar} = useSnackbarFeedback();
  const classes = useStyles();

  return (
    <>
      {successBar}
      {failBar}
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>
          <Typography>
            添加新书籍
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            href: '',
            linkKey: '',
          }}
          onSubmit={async values => {
            const {href, linkKey} = values;
            const link = linkKey === '' ? {href: href} : values;
            adminService.post(link)
              .catch(
                e => fail(e)
              );
            success();
          }}
          validationSchema={NewBookSchema}
        >
          {({submitForm, isSubmitting, resetForm}) => {
            return (
              <>
                <DialogContent>
                  {
                    isSubmitting && <LinearProgress/>
                  }
                  <Grid container direction={'column'} alignItems={"stretch"}>
                    <Field
                      name={"href"}
                      label={"原网址"}
                      component={TextField}
                      className={classes.field}
                    />
                    <Field
                      name={"linkKey"}
                      label={"短链接网址"}
                      component={TextField}
                      placeholder={"为空将自动生成短链接"}
                      className={classes.field}
                    />
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Grid item container direction={"row"} justify={"space-around"}>
                    <Button color={"primary"} variant={"contained"} onClick={() => submitForm()}>
                      新增连接
                    </Button>
                    <Button color={"secondary"} variant={"contained"} onClick={() => resetForm()}>
                      重置
                    </Button>
                  </Grid>
                </DialogActions>
              </>
            )
          }}
        </Formik>
      </Dialog>
    </>
  )
}