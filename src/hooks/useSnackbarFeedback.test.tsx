import React from "react";
import {Button} from '@material-ui/core';
import {act, fireEvent, render, waitFor} from "@testing-library/react";
import {useSnackbarFeedback} from './useSnackbarFeedback'
import {getByDeepText} from "../utils/getByDeepText";

/*
* sleep ms
* 在 javascript 中模拟睡眠函数
*/
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const Component = function () {
  const {success, successBar, fail, failBar} = useSnackbarFeedback();
  return (<>
    {successBar}
    {failBar}
    <Button onClick={() => success()}>success</Button>
    <Button onClick={() => fail()}>fail</Button>
  </>)
}

const CustomComponent = function () {
  const {success, successBar, fail, failBar} = useSnackbarFeedback();
  return (<>
    {successBar}
    {failBar}
    <Button onClick={() => success('successMsg')}>success</Button>
    <Button onClick={() => fail('failMsg')}>fail</Button>
  </>)
}
/*
* 检测 useSnackbarFeedback
* 检测 useSnackbarFeedback 正确渲染提示，自动消失提示
* @author wfn
*/
describe('useSnackbarFeedback test', () => {
  it('should alert success correctly', async () => {
    const {getByText} = render(<Component/>)
    act(() => {
      fireEvent.click(getByText('success'));
    })
    await waitFor(() => {
      expect(getByDeepText('操作成功！')).toBeVisible();
    })
    await sleep(3000); // wait for Alert disappear
    expect(getByDeepText('操作成功！')).not.toBeVisible();
  })

  it('should alert fail correctly', async () => {
    const {getByText} = render(<Component/>)
    act(() => {
      fireEvent.click(getByText('fail'));
    })
    await waitFor(() => {
      expect(getByDeepText('操作失败！')).toBeVisible();
    })
    await sleep(3000); // wait for Alert disappear
    expect(getByDeepText('操作失败！')).not.toBeVisible();
  })

  it('should display custom message if provided', async () => {
    const {getByText} = render(<CustomComponent/>)
    act(() => {
      fireEvent.click(getByText('success'));
    })
    await waitFor(() => {
      expect(getByDeepText('successMsg')).toBeVisible();
    })
    act(() => {
      fireEvent.click(getByText('fail'));
    })
    await waitFor(() => {
      expect(getByDeepText('failMsg')).toBeVisible();
    })
  })
})