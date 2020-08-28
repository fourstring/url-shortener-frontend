import React from "react";
import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {IDataTableFilterProps, IDataTableFilterOption, IDataTableFilterOutput} from "../../types/IDataTable";
import {useMultiFilter} from "./useMultiFilter";
import {sleep, getByDeepText} from "../../utils/tests"

let testDateTableFilterOption1 : IDataTableFilterOption = {
  label : 'testLabel1',
  value : 'testValue1'
};

let testDateTableFilterOption2 : IDataTableFilterOption = {
  label : 'testLabel2',
  value : 'testValue2'
};

let testDataTableFilterOutput : IDataTableFilterOutput = {
  name : 'testName',
  value : ['testValue1']
};

let dataTableFilterProps = async () => { return [testDateTableFilterOption1, testDateTableFilterOption2] };

let testDataTableFilterProps : IDataTableFilterProps = {
  name : 'testName',
  placeholder : 'testPlaceholder',
  optionFetcher : dataTableFilterProps
};

/*
* 检测 useMultiFilter
* 检查 useMultiFilter 是否能够成功渲染并且选项框可选触发onchange
* @author lzl
*/
describe('test useMultiFilter', () => {
  it('should correctly render and trigger', async () => {
    // const {getByRole} = render(<Component/>);
    // expect(getByDeepText(`testPlaceholder`)).toBeInTheDocument();
    // fireEvent.mouseDown(getByRole('button'));
    // await sleep(3000);
    // const listBox = within(getByRole('listbox'));
    // fireEvent.click(listBox.getByText(/testLabel1/i));

    let outerSelectedOption;
    const Component = function () {
      const [selectedOption, filter] = useMultiFilter(testDataTableFilterProps);
      outerSelectedOption = selectedOption;
      console.log(testDataTableFilterProps.optionFetcher);
      return (<>
        {filter}
      </>)
    }

    const {getByRole} = render(<Component/>);
    expect(getByDeepText(`testPlaceholder`)).toBeInTheDocument();

    act(()=>{
      fireEvent.mouseDown(getByRole('button'));
    });
    await sleep(3000);
    const listBox = within(getByRole('listbox'));

    act(()=>{
      fireEvent.click(listBox.getByText(/testLabel1/i));
    });

    expect(outerSelectedOption).toStrictEqual(testDataTableFilterOutput);

  })
});
