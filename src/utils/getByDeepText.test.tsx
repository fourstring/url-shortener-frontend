import React from "react";
import {render} from "@testing-library/react";
import {getByDeepText} from "./getByDeepText";

describe('getByDeepText test', () => {
  it('should get', async () => {
    render(
      <div>
        Hello <span>world</span>
      </div>
    );
    expect(getByDeepText("Hello world")).toBeInTheDocument();
  });
});