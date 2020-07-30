import React from "react";
import {render} from "@testing-library/react";
import {Alert} from "./Alert";

/*
* 检测 Alert
* Alert 是否显示提供的提醒内容
* @author wfn
*/
describe('Alert test', () => {
  it('should render components correctly', async () => {
    const {getByText} = render(
      <Alert>Test</Alert>
    );
    expect(getByText("Test")).toBeInTheDocument();
  });
});