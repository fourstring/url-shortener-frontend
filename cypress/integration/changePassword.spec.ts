/*
* changePassword e2e 测试
* 检测 changePassword 的各种功能
* @author lzl
*/
// @ts-ignore
const cy = Cypress.cy;
describe('Test changePassword function', function () {

  /*
  * 登陆并跳转
  * 检测能否正确登陆并正确跳转到changePassword界面
  * @author lzl
  */
  it('should render correctly and login successfully', function () {
    cy.visit("/login");
    cy.get('[placeholder="请输入用户名"]').type('testUser');
    cy.get('[placeholder="请输入密码"]').type('testPassword');
    cy.contains(/^登陆$/).click();
    cy.get('.MuiAvatar-root').click();
    cy.contains(/修改密码/).click();
    cy.url()
      .should('eq', Cypress.config().baseUrl + '/changePassword');
  })

  /*
  * 测试changePassword页面的功能
  * 检测密码错误能否正确执行并且重置功能是否正确
  * @author lzl
  */
  it('should return a alert and can reset successfully', function () {
    cy.get('[placeholder="请输入旧密码"]').type('123123123');
    cy.get('[placeholder="请输入新密码"]').type('11111111');
    cy.get('[placeholder="请确认新密码"]').type('11111111');
    cy.contains(/^修改$/).click();
    cy.contains(/^重置$/).click();
  });

  /*
  * 测试changePassword页面的功能
  * 检测能否正确修改并跳转
  * @author lzl
  */
  it('should modify and redirect successfully', function () {
    cy.get('[placeholder="请输入旧密码"]').type('88888888');
    cy.get('[placeholder="请输入新密码"]').type('11111111');
    cy.get('[placeholder="请确认新密码"]').type('11111111');
    cy.contains(/^修改$/).click();
    cy.url()
      .should('eq', Cypress.config().baseUrl + '/login');
  });

  /*
  * 测试changePassword页面的功能
  * 检测返回能否正确返回
  * @author lzl
  */
  it('should return to shorten', function () {
    cy.visit("/login");
    cy.get('[placeholder="请输入用户名"]').type('testUser');
    cy.get('[placeholder="请输入密码"]').type('testPassword');
    cy.contains(/^登陆$/).click();
    cy.get('.MuiAvatar-root').click();
    cy.contains(/修改密码/).click();
    cy.contains(/返回/).click();
    cy.url()
      .should('eq', Cypress.config().baseUrl + '/shorten');
  });
});
