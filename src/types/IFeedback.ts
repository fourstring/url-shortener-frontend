import React from "react";

export interface IFeedbackStatus {
  msg: string;
  open: boolean;
}

export interface IFeedback {
  success: (successMsg?: string) => void;
  successBar: React.ReactNode;
  fail: (failMsg?: string) => void;
  failBar: React.ReactNode;
}