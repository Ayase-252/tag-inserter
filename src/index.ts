import { BlockNode } from "./types";
import Markup, { LegacyMarkup } from "./markup";
import { extractStartTagFromElement } from "./parser";

function createFragmentFromStr(htmlStr: string) {
  const fragment = document.createElement("div");
  fragment.innerHTML = htmlStr;
  return fragment;
}

function parseHTMLElementToBlockNode(elem: HTMLElement): BlockNode {
  function addOffsetForMarkupInsideElement(
    markups: Markup[]
  ): Markup[] {
    return markups.map((markup) => {
      markup.start = currCol + markup.start - 1
      markup.end = currCol + markup.end - 1
      return markup
    });
  }
  let text = "";
  const markups: Markup[] = [];
  let currCol = 1;
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
        ...addOffsetForMarkupInsideElement(markupsInChildNodes)
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

export function parseHTMLStringToNode(htmlStr: string): BlockNode {
  const fragment = createFragmentFromStr(htmlStr);
  return parseHTMLElementToBlockNode(fragment);
}
