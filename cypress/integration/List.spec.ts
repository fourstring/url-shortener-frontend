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


  /*
  * List 正确跳转测试
  * 检测 List 点击相应 详情按钮 正确跳转(点击listItem2)
  * 跳转后 url 正确
  * @author ydx
  */
 it('should change the URL when button is clicked',() => {
  
    cy.visit('localhost:3000/links')
    cy.get("#root > ul > div:nth-child(3) > a > button > span.MuiIconButton-label > svg").click()
    cy.url().should('eq', "http://localhost:3000/links/2")
  })

    /*
  * Detail 返回跳转测试
  * 检测 Detail 点击相应 返回按钮 正确跳转
  * 跳转后 url 正确
  * @author ydx
  */
 it('should return to the List when button is clicked',() => {
    cy.visit('localhost:3000/links')
    cy.get("#root > ul > div:nth-child(5) > a > button > span.MuiIconButton-label > svg").click()
    cy.get('#return').click()
    // cy.url().should('eq', "http://localhost:3001/links")
  })

//     /*
//   * List 删除测试
//   * 检测 List 点击相应 删除 post请求 (点击第三行delete)
//   * 跳转后 url 正确
//   * @author ydx
//   */
//  it('should change the URL when button is clicked',() => {
//     cy.visit('localhost:3001/links')
//     cy.get("#root > ul > div:nth-child(5) > button > span.MuiIconButton-label > svg").click()
//     cy.request({
//         method: "DELETE",
//         url:"http://localhost:3001/links/3"
//     })
//   })
})