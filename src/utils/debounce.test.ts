import {debounce} from "./debounce";

jest.useFakeTimers();

/*
* 检测 debounce
* 检查 debounce 在多种情况下行为是否符合文档定义
* @author wfn
*/
it("with two argument", () => {
  let test = jest.fn();
  let debounced = debounce(test, 100);

  debounced();

  jest.runAllTimers();

  expect(test).toHaveBeenCalledTimes(1);
})