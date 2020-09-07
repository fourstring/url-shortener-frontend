import React from "react";
import {CardItem} from "./CardItem"
import {link} from "../mocks/mockDb";
import {List} from "@material-ui/core";
import {render} from "@testing-library/react";
import {testLinkService} from "../mocks/testClient";


/*
* 检测 ListItem
* ListItem 是否正确显示data内容
* @author ydx
*/
describe("ListItem test", () => {
  it('should render components correctly', async () => {
    const {getByText} = render(
        <CardItem item={link[0]}/>
    );
    expect(getByText(`${testLinkService.buildShortenLink(link[0].linkKey)}`)).toBeInTheDocument();
    expect(getByText(`${link[0].href}`)).toBeInTheDocument();
  })
})