import Markup from "../markup";
import { renderBlockNode } from "../renderer";
import { BlockNode } from "../types";

describe("renderer", () => {
  it("should render a block node into html", () => {
    const blockNode = {
      text: "hello world",
      markups: [
        new Markup({
          start: 3,
          end: 4,
          startTag: "<b>",
          type: "b",
        }),
      ],
    } as BlockNode;
    const str = renderBlockNode(blockNode);
    expect(str).toBe("he<b>ll</b>o world");
  });
});
