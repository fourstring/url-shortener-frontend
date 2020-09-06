/*
* shorten e2e 测试
* 检测 shorten 正确渲染
* 其中未登录和已登录部分需要和login界面代码整合使用
* @author lzl
*/
// @ts-ignore
const cy = Cypress.cy;
describe('Test shorten function', function () {

  /*
  * shorten e2e 测试
  * 检测 shorten 正确渲染
  * @author lzl
  */
  it('should render correctly', function () {
    cy.visit("/shorten");
    cy.contains('缩短链接');
    cy.contains('原链接');
    cy.contains('生成短链接');
    cy.contains('查看所有短链接');
  })
});


/*
* shorten e2e 测试
* 未登录情况下的alert测试
* @author lzl
*/
describe('Test shorten function when not login', function () {
  /*
    * 未登录情况下测试shorten e2e是否alert
    * 检测未登录情况下点击两个按钮是否弹出alert
    * @author lzl
    */
  it('should return alert information', function () {
    cy.visit("/shorten");
    cy.get('#shortenButton').click()
      .then(() => {
        cy.contains('请先登录！')
      });
    cy.visit("/shorten");
    cy.get('#showAllButton').click()
      .then(() => {
        cy.contains('请先登录！')
      })
  })
});

/*
* shorten e2e 测试
* 登录情况下的功能与跳转测试
* @author lzl
*/
describe('Test shorten function when login', function () {
  /*
    * 登录情况下测试shorten功能
    * 检测登录情况下点击生成按钮是否正确返回
    * @author lzl
    */
  it('should return an address', function () {
    cy.visit("/login");
    cy.get('[placeholder="请输入用户名"]').type('testUser');
    cy.get('[placeholder="请输入密码"]').type('testPassword');
    cy.contains(/^登陆$/).click();
    cy.get('#hrefField').type('test.com');
    cy.get('#shortenButton').click();
    cy.contains('https://api.fourstring.dev/s/abcdefg')
  })

  /*
    * 登录情况下测试跳转links功能
    * 检测登录情况下点击查看所有按钮是否正确跳转
    * @author lzl
    */
  it('should change to links window', function () {
    cy.visit("/login");
    cy.get('[placeholder="请输入用户名"]').type('testUser');
    cy.get('[placeholder="请输入密码"]').type('testPassword');
    cy.contains(/^登陆$/).click();
    cy.get('#showAllButton').click()
    cy.url()
      .should('eq', Cypress.config().baseUrl + '/links');
  })



});
