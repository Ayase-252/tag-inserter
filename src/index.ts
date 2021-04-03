import { BlockNode, Markup } from "./types";

function createFragmentFromStr(htmlStr: string) {
  const fragment = document.createElement("div");
  fragment.innerHTML = htmlStr;
  return fragment;
}

function extractOpeningTagFromElement(elem: HTMLElement): string {
  const START_TAG_REGEX = /<[a-z]+.*?>/;
  const outerHTML = elem.outerHTML;
  const startTagMatch = START_TAG_REGEX.exec(outerHTML);
  if (startTagMatch === null) {
    console.error("Cannot find start tag for node", outerHTML);
    throw new Error("Cannot find start tag for node");
  }
  return startTagMatch[0];
}

export function parseHTMLStringToNode(htmlStr: string): BlockNode {
  const fragment = createFragmentFromStr(htmlStr);

  function parseHTMLElementToBlockNode(elem: HTMLElement): BlockNode {
    function addOffsetForMarkupInsideElement(markups: Markup[]): Markup[] {
      return markups.map((markup) => {
        return Object.assign({}, markup, {
          start: currCol + markup.start - 1,
          end: currCol + markup.end - 1,
        });
      });
    }
    let text = "";
    const markups = [];
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

        const markupInCurrentChild: Markup = {
          start: currCol,
          end: currCol + child.textContent.length - 1,
          type: child.nodeName.toLowerCase(),
          startTag: extractOpeningTagFromElement(child as HTMLElement),
        };
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
  return parseHTMLElementToBlockNode(fragment);
}
