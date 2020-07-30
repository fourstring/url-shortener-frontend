import config from './config';

/*
* 检查 config 参数
* 为 config 添加快照，测试 config 状态不变
* @author wfn
*/
test('test config', () => {
  expect(config).toMatchSnapshot();
});