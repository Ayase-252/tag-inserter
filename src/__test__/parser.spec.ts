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
    const markup = node.markups[0];
    expect(markup.start).toEqual(7);
    expect(markup.end).toEqual(9);
    expect(markup.startTag).toEqual(`<span class="hello world">`);
    expect(markup.type).toEqual("span");
  });

  it("should parse nested inline tag correctly", () => {
    const node = parseHTMLStringToNode(
      `hello <span class="hello world">w<b>o</b>r</span>ld`
    );
    expect(node.text).toBe("hello world");

    let markup = node.markups[0];
    expect(markup.start).toEqual(7);
    expect(markup.end).toEqual(9);
    expect(markup.startTag).toEqual(`<span class="hello world">`);
    expect(markup.type).toEqual("span");

    markup = node.markups[1];
    expect(markup.start).toEqual(8);
    expect(markup.end).toEqual(8);
    expect(markup.startTag).toEqual(`<b>`);
    expect(markup.type).toEqual("b");
  });

  it("should parse nested tag in the head of string correctly", () => {
    const node = parseHTMLStringToNode(`<b>hell</b>o world`);

    expect(node.text).toBe("hello world");
    const markup = node.markups[0];
    expect(markup.start).toEqual(1);
    expect(markup.end).toEqual(4);
    expect(markup.startTag).toEqual(`<b>`);
    expect(markup.type).toEqual("b");
  });
});
