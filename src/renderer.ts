import { Markup, BlockNode } from ".";

type MarkupEvent = {
  event: "start" | "end";
  relatedMarkup: Markup;
};

function getMarkupOpenTag(markup: Markup) {
  return markup.startTag;
}

function getMarkupCloseTag(markup: Markup) {
  return `</${markup.type}>`;
}

export function renderBlockNode(blockNode: BlockNode): string {
  const eventsMap = new Map<number, MarkupEvent[]>();
  const idxMarks = new Set<number>();
  // transform block node to a series of open and close operation of a node
  blockNode.markups.forEach(markup => {
    eventsMap.set(
      markup.start,
      (eventsMap.get(markup.start) || []).concat([
        { event: "start", relatedMarkup: markup }
      ])
    );
    idxMarks.add(markup.start);

    eventsMap.set(
      markup.end + 1,
      (eventsMap.get(markup.end + 1) || []).concat([
        { event: "end", relatedMarkup: markup }
      ])
    );
    idxMarks.add(markup.end + 1);
  });

  let renderedText = "";
  let currIdx = 0;
  const sortedIdxMarks = Array.from(idxMarks).sort((a, b) => a - b);

  for (const idx of sortedIdxMarks) {
    const eventInCurr = eventsMap.get(idx);
    renderedText += blockNode.text.substring(currIdx, idx - 1);

    eventInCurr &&
      eventInCurr.forEach(event => {
        if (event.event === "start") {
          renderedText += getMarkupOpenTag(event.relatedMarkup);
        } else {
          renderedText += getMarkupCloseTag(event.relatedMarkup);
        }
      });

    currIdx = idx - 1;
  }

  renderedText += blockNode.text.substring(currIdx);
  return renderedText;
}
