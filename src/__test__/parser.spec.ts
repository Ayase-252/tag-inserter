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
    expect(markup.startTag).toEqual(`<span class="hello world">`);
    expect(markup.type).toEqual("span");
  });

  it("should parse nested inline tag correctly", () => {
    const node = parseHTMLStringToNode(
      `hello <span class="hello world">w<b>o</b>r</span>ld`
    );
    expect(node.text).toBe("hello world");

    let markup = node.markups[0];
    expect(markup.startTag).toEqual(`<span class="hello world">`);
    expect(markup.type).toEqual("span");

    markup = node.markups[1];
    expect(markup.startTag).toEqual(`<b>`);
    expect(markup.type).toEqual("b");
  });

  it("should parse nested tag in the head of string correctly", () => {
    const node = parseHTMLStringToNode(`<b>hell</b>o world`);

    expect(node.text).toBe("hello world");
    const markup = node.markups[0];
    expect(markup.startTag).toEqual(`<b>`);
    expect(markup.type).toEqual("b");
  });

  it.each([
    ['hello <span class="hello world">wor</span>ld', [{ start: 7, end: 9 }]],
    [
      'hello <span class="hello world">w<b>o</b>r</span>ld',
      [
        { start: 7, end: 9 },
        { start: 8, end: 8 },
      ],
    ],
    ["<b>hell</b>o world", [{ start: 1, end: 4 }]],
  ])(
    "should get correct start and end index in %s",
    (text, expectedMarkups) => {
      const node = parseHTMLStringToNode(text);

      expectedMarkups.forEach((expected, i) => {
        const markup = node.markups[i];
        const { start, end } = expected;
        expect(markup.start).toEqual(start);
        expect(markup.end).toEqual(end);
      });
    }
  );
});
