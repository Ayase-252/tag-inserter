import { BlockNode } from "./types";
import Markup from "./markup";

function extractStartTagFromElement(elem: HTMLElement): string {
  const START_TAG_REGEX = /<[a-z]+.*?>/;
  const outerHTML = elem.outerHTML;
  const startTagMatch = START_TAG_REGEX.exec(outerHTML);
  if (startTagMatch === null) {
    console.error("Cannot find start tag for node", outerHTML);
    throw new Error("Cannot find start tag for node");
  }
  return startTagMatch[0];
}

export function parseHTMLElementToBlockNode(elem: HTMLElement): BlockNode {
  function addOffsetForNestedMarkup(markups: Markup[]): Markup[] {
    return markups.map((markup) => {
      markup.start = currCol + markup.start;
      markup.end = currCol + markup.end;
      return markup;
    });
  }
  let text = "";
  const markups: Markup[] = [];
  let currCol = 0;
  for (const child of Array.from(elem.childNodes)) {
    if (!child.textContent) {
      continue;
    }
    if (child.nodeType === Node.ELEMENT_NODE) {
      const markupsInChildNodes =
        child.childNodes.length > 0
          ? parseHTMLElementToBlockNode(child as HTMLElement).markups
          : [];

      const markupInCurrentChild = new Markup({
        start: currCol,
        end: currCol + child.textContent.length - 1,
        type: child.nodeName.toLowerCase(),
        startTag: extractStartTagFromElement(child as HTMLElement),
      });
      markups.push(
        markupInCurrentChild,
        ...addOffsetForNestedMarkup(markupsInChildNodes)
      );
    }
    text += child.textContent;
    currCol += child.textContent.length;
  }
  return {
    text,
    markups,
  };
}
