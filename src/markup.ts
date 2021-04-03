export type LegacyMarkup = {
  // Index where Markup starts, 1-based
  start: number;
  // Index where Markup ends, 1-based
  end: number;
  // Content of starting tag, like <span class="foo bar">
  startTag: string;
  // Type of Tag, like span
  type: string;
};

class Markup {
  _markup: LegacyMarkup;
  constructor(markup: LegacyMarkup) {
    this._markup = markup;
  }

  get startTag() {
    return this._markup.startTag;
  }

  get closeTag() {
    return `</${this._markup.type}>`;
  }

  set start(val: number) {
    this._markup.start = val;
  }

  get start() {
    return this._markup.start;
  }

  set end(val: number) {
    this._markup.end = val;
  }

  get end() {
    return this._markup.end;
  }

  get type() {
    return this._markup.type;
  }
}

export default Markup;
