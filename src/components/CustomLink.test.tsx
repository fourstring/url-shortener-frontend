import React from "react";
import {CustomLink} from "./CustomLink";

describe("Link test", ()=>{
  it('should render components according to props correctly ',  ()=> {
    const warpper = <CustomLink to={`/Test`}/>
    expect(warpper.props.to).toBe("/Test");
  });
})