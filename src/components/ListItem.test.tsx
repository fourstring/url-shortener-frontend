import React from "react";
import {ListItem} from "./ListItem"
import {link} from "../mocks/mockDb";
import {
    List
} from "@material-ui/core";
import {render} from "@testing-library/react";

describe("ListItem test", ()=>{
    it('should render components correctly', async()=>{
        const {getByText} = render(
            <List>
              <ListItem item={link[0]}/>
            </List>
          );
        expect(getByText("https://sourl.cn")).toBeInTheDocument();
    })
})