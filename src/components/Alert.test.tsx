import React from "react";
import {render} from "@testing-library/react";
import {Alert} from "./Alert";

describe('Alert test', () => {
  it('should render components correctly', async () => {
    const {getByText} = render(
      <Alert>Test</Alert>
    );
    expect(getByText("Test")).toBeInTheDocument();
  });
});