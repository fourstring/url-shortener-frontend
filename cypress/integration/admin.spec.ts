/*
* AdminList table e2e 测试
* 检测 List 正确渲染和跳转
* @author wfn
*/
// @ts-ignore
const cy = Cypress.cy;
describe("AdminList e2e test", ()=>{
  it('should visit successfully', ()=> {
    // login first
    cy.visit('/login')
    cy.get('[placeholder="请输入用户名"]')
      .type('admin')
    cy.get('[placeholder="请输入密码"]')
      .type('12345678')
    cy.get('button').contains('登陆')
      .click();

    // go to admin table
    cy.contains('短链接管理').click();
  });

  it('should disable link successfully', () => {
    cy.get('[index="0"] > [style="width: 144px; padding: 0px 5px; box-sizing: border-box;"] > div > [title="禁用短连接"]')
      .click();
    cy.get('[index="0"]')
      .contains('已禁用')
    cy.contains('操作成功')
  })

  it('should enable link successfully', () => {
    cy.get('[index="0"] > [style="width: 144px; padding: 0px 5px; box-sizing: border-box;"] > div > [title="启用短连接"]')
      .click();
    cy.get('[index="0"]')
      .contains('正常')
    cy.contains('操作成功')
  })

  it('should delete link successfully', () => {
    cy.get('[index="0"]')
      .contains('https://nimo.sjtu.edu.cn/');
    cy.get('[index="0"] > [style="width: 144px; padding: 0px 5px; box-sizing: border-box;"] > div > [title="删除短连接"]')
      .click();
    cy.get('[index="0"]')
      .contains('https://github.com/fourstring/url-shortener-frontend');
  })

  it('should goto next page successfully', () => {
    cy.get('[title="Next Page"] > .MuiButtonBase-root')
      .click();
    cy.get('.MTablePaginationInner-root-46 > .MuiTypography-root')
      .contains('6-10');
  })

  it('should add new link successfully', () => {
    cy.get('.MTableToolbar-actions-36 > :nth-child(1) > div')
      .click();
    cy.contains('添加新书籍')
    cy.get('.MuiDialogContent-root > .MuiGrid-root > :nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
      .type('href')
    cy.get('[placeholder="为空将自动生成短链接"]')
      .type('linkKey')
    cy.contains('新增连接')
      .click()
    cy.contains('操作成功')
  })
});