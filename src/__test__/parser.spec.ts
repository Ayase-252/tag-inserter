import { parseHTMLStringToNode } from "..";

describe("Parser", () => {
  it("should parse text correctly", () => {
    const node = parseHTMLStringToNode("hello world");

    expect(node.text).toBe("hello world");
  });

  it("should parse inline tag into markup", () => {
    const node = parseHTMLStringToNode(
      `hello <span class="hello world">wor</span>ld`
    );

    expect(node.text).toBe("hello world");
    expect(node.markups[0]).toEqual({
      start: 7,
      end: 9,
      startTag: `<span class="hello world">`,
      type: "span",
    });
  });

  it("should parse nested inline tag correctly", () => {
    const node = parseHTMLStringToNode(
      `hello <span class="hello world">w<b>o</b>r</span>ld`
    );
    expect(node.text).toBe("hello world");
    expect(node.markups[0]).toEqual({
      start: 7,
      end: 9,
      startTag: `<span class="hello world">`,
      type: "span",
    });

    expect(node.markups[1]).toEqual({
      start: 8,
      end: 8,
      startTag: `<b>`,
      type: "b",
    });
  });

  it("should parse nested tag in the head of string correctly", () => {
    const node = parseHTMLStringToNode(`<b>hell</b>o world`);

    expect(node.text).toBe("hello world");
    expect(node.markups[0]).toEqual({
      start: 1,
      end: 4,
      startTag: `<b>`,
      type: "b",
    });
  });
});
