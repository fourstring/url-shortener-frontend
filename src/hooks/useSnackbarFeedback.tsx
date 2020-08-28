import React, {useState} from "react";
import {IFeedback, IFeedbackStatus} from "../types/IFeedback";
import {Alert} from "../components/Alert";
import {Snackbar} from "@material-ui/core";

export function useSnackbarFeedback(): IFeedback {
  const [successStatus, setSuccessStatus] = useState<IFeedbackStatus>({
    msg: '操作成功！',
    open: false
  });
  const [failStatus, setFailStatus] = useState<IFeedbackStatus>({
    msg: '操作失败！',
    open: false
  });

  function handleSuccess(successMsg?: string) {
    setSuccessStatus(prevState => ({
      msg: successMsg ? successMsg : prevState.msg,
      open: true
    }));
  }

  function handleFail(failMsg?: string) {
    setFailStatus(prevState => ({
      msg: failMsg ? failMsg : prevState.msg,
      open: true
    }));
  }

  function handleSuccessClose() {
    setSuccessStatus(prevState => ({
      ...prevState,
      open: false
    }));
  }

  function handleFailClose() {
    setFailStatus(prevState => ({
      ...prevState,
      open: false
    }));
  }

  return {
    success: handleSuccess,
    fail: handleFail,
    successBar: (
      <Snackbar open={successStatus.open} autoHideDuration={3000} onClose={handleSuccessClose}>
        <Alert severity={"success"}>
          {successStatus.msg}
        </Alert>
      </Snackbar>
    ),
    failBar: (
      <Snackbar open={failStatus.open} autoHideDuration={3000} onClose={handleFailClose}>
        <Alert severity={"error"}>
          {failStatus.msg}
        </Alert>
      </Snackbar>
    )
  }
}
