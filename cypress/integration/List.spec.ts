/*
* List e2e 测试
* 检测 List 正确渲染和跳转
* @author ydx
*/
// @ts-ignore

import { cyan } from "@material-ui/core/colors"
import {testAdapter, testPagedData, testLink} from '../../src/mocks/testData'
import {Adapter} from "../../src/mocks/e2eClient";

describe("List e2e test", ()=>{
  Adapter.onGet('/links').reply(config => {
    return [200, testPagedData]
  });
  
    /*
  * List 正确渲染测试
  * 检测渲染出的 List 含有标题和我们需要展示的 Tab 元素
  * @author ydx
  */

 it('should render list correctly', () => {
    cy.visit('localhost:3000/links')
  })

})