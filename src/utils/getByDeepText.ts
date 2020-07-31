import {screen} from "@testing-library/react";

export function getByDeepText(text: string) {
  return screen.getByText((content: string, node: Element) => {
    const hasText = (node: Element) => node.textContent === text;
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node.children).every(
      (child: Element) => !hasText(child)
    );
    return nodeHasText && childrenDontHaveText;
  });
}