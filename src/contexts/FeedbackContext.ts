import {IFeedback} from "../types/IFeedback";
import React from "react";

export const FeedbackContext = React.createContext<IFeedback>({
  fail(failMsg: string | undefined): void {
  }, failBar: undefined, success(successMsg: string | undefined): void {
  }, successBar: undefined
});
