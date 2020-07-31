/*
* List e2e 测试
* 检测 List 正确渲染和跳转
* @author wfn
*/
// @ts-ignore
const cy = Cypress.cy;

describe("list e2e test", ()=>{
  it('should render list', ()=>{
    cy.visit('/login')
    cy.get('[placeholder="请输入用户名"]')
      .type('username')
    cy.get('[placeholder="请输入密码"]')
      .type('12345678')
    cy.get('button').contains('登陆')
      .click();
    cy.visit('/links')
    cy.contains('string');
    cy.contains('//api.fourstring.dev/s/string');
    cy.contains('删除');
  })
})