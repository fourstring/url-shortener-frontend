import React from "react";
import {render} from "@testing-library/react";
import {getByDeepText, sleep} from "./tests";

describe('getByDeepText test', () => {
  it('should get', async () => {
    render(
      <div>
        Hello <span>world</span>
      </div>
    );
    await sleep(3000);
    expect(getByDeepText("Hello world")).toBeInTheDocument();
  });
});
