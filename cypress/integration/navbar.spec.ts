// import {routes} from '../../src/routes'
// import {TabData} from '../../src/components/NavBar'
/*
* NavBer e2e 测试
* 检测 NavBer 正确渲染，高亮和跳转
* @author wfn
*/
// @ts-ignore
describe('NavBer e2e test', () => {
  /*
  * NavBer 正确渲染测试
  * 检测渲染出的 NavBer 含有标题和我们需要展示的 Tab 元素
  * @author wfn
  */
  it('should render tabs correctly', () => {
    cy.visit('/')
    cy.contains('短链接生成器')
    cy.contains('首页')
    cy.contains('我的短链接')
  })

  /*
 * NavBer 正确高亮测试
 * 检测 NavBer 高亮的元素和当前 url 相匹配
 * 通过寻找代表高亮的 css 标签并检测其内容判断
 * @author wfn
 */
  it('should highlight the correct tab', () => {
    cy.visit('/')
    cy.get('.Mui-selected').contains('首页')
    cy.visit('/links')
    cy.get('.Mui-selected').contains('我的短链接')
  })

  /*
  * NavBer 正确跳转测试
  * 检测 NavBer 点击相应 Tab 正确跳转
  * 跳转后 url 正确，高亮正确
  * @author wfn
  */
  it('should change the URL when tab is clicked',() => {
    cy.visit('/links')
    cy.get('.Mui-selected')
      .contains('我的短链接')
    cy.contains('首页').click()
    cy.url()                   // 8.
      .should('eq', Cypress.config().baseUrl+'/');
    cy.get('.Mui-selected').contains('首页')
  })
})
