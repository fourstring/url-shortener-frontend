import React from "react";
import {act, renderHook} from '@testing-library/react-hooks'
import {useCheckboxes} from "./useCheckboxes";
import {ILink} from "../types/ILink";
import {link, linkDb} from "../mocks/mockDb";

/**
 * 检测 useCheckboxes
 * @author ydx
 */
describe("Test useCheckboxes", () => {
  /**
   * 检测传入useCheckboxes内是ILink[]类型
   * @author ydx
   */

  it('should render components correctly ', () => {
    const {result} = renderHook(() => useCheckboxes<ILink>(link));
    expect(result.current.selected).toBeNull;

    act(() => {
      result.current.select(1);
    })

    expect(result.current.selected).toContain(1);

    act(() => {
      result.current.clear();
    })

    expect(result.current.selected).toBeNull;
  }),

  /**
   * 检测传入useCheckboxes内是Map类型
   * 构造一个对象含有target.name来检测渲染是否正确
   * @author ydx
   */
    it('should render components correctly', () => {
      const {result} = renderHook(() => useCheckboxes<ILink>(linkDb));
      expect(result.current.selected).toBeNull;

      interface testObject2 {
        name: string;
      }

      interface testObject {
        target: testObject2;
      }

      let test2: testObject2 = {
        name: "1"
      }
      let test: testObject = {
        target: test2
      }
      act(() => {
        result.current.checkboxes.get(1)?.props.onChange(test);
      })

      expect(result.current.selected).toContain(1);
    })
})