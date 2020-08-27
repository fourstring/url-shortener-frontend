import React from "react";
import {fireEvent, render, screen, within} from "@testing-library/react";
import {IDataTableFilterProps, IDataTableFilterOption} from "../../types/IDataTable";
import {useSingleFilter} from "./useSingleFilter";

function getByDeepText(text: string) {
  return screen.getByText((content: string, node: Element) => {
    const hasText = (node: Element) => node.textContent === text;
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node.children).every(
      (child: Element) => !hasText(child)
    );
    return nodeHasText && childrenDontHaveText;
  });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let testDateTableFilterOption1 : IDataTableFilterOption = {
  label : 'testLabel1',
  value : 'testValue1'
};

let testDateTableFilterOption2 : IDataTableFilterOption = {
  label : 'testLabel2',
  value : 'testValue2'
};

let dataTableFilterProps = async () => { return [testDateTableFilterOption1, testDateTableFilterOption2] };

let testDataTableFilterProps : IDataTableFilterProps = {
  name : 'testName',
  placeholder : 'testPlaceholder',
  optionFetcher : dataTableFilterProps
};

const Component = function () {
  const [selectedOption, filter] = useSingleFilter(testDataTableFilterProps);
  console.log(testDataTableFilterProps.optionFetcher);
  return (<>
    {filter}
  </>)
}

/*
* 检测 useSingleFilter
* 检查 useSingleFilter 是否能够成功渲染并且选项框可选触发onchange
* @author lzl
*/
describe('test useSingleFilter', () => {
  it('should correctly render and trigger', async () => {
    const {getByRole} = render(<Component/>);
    expect(getByDeepText(`testPlaceholder`)).toBeInTheDocument();
    fireEvent.mouseDown(getByRole('button'));
    await sleep(3000);
    const listBox = within(getByRole('listbox'));
    fireEvent.click(listBox.getByText(/testLabel1/i));
  })
});
