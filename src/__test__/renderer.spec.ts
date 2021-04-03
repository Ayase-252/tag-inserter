import { renderBlockNode } from "../renderer";

describe("renderer", () => {
  it("should render a block node into html", () => {
    const blockNode = {
      text: "hello world",
      markups: [
        {
          start: 3,
          end: 4,
          startTag: "<b>",
          type: "b",
        },
      ],
    };
    const str = renderBlockNode(blockNode);
    expect(str).toBe("he<b>ll</b>o world");
  });
});
