import { parseHTMLStringToNode } from "..";

describe("parseHTMLStringToNode", () => {
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
    ['hello <span class="hello world">wor</span>ld', [{ start: 6, end: 8 }]],
    [
      'hello <span class="hello world">w<b>o</b>r</span>ld',
      [
        { start: 6, end: 8 },
        { start: 7, end: 7 },
      ],
    ],
    ["<b>hell</b>o world", [{ start: 0, end: 3 }]],
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

  it("should parse a tag into markup", () => {
    const node = parseHTMLStringToNode(
      `hello<a src="https://hello.com?query=1">wor</a>ld`
    );

    const markup = node.markups[0];
    expect(markup.startTag).toEqual('<a src="https://hello.com?query=1">');
  });
});
