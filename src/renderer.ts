import Markup from "./markup";
import { BlockNode } from "./types";

type MarkupEvent = {
  event: "start" | "end";
  relatedMarkup: Markup;
};

export function renderBlockNode(blockNode: BlockNode): string {
  const eventsMap = new Map<number, MarkupEvent[]>();
  const idxMarks = new Set<number>();
  // transform block node to a series of open and close operation of a node
  blockNode.markups.forEach((markup) => {
    eventsMap.set(
      markup.start,
      (eventsMap.get(markup.start) || []).concat([
        { event: "start", relatedMarkup: markup },
      ])
    );
    idxMarks.add(markup.start);

    eventsMap.set(
      markup.end + 1,
      (eventsMap.get(markup.end + 1) || []).concat([
        { event: "end", relatedMarkup: markup },
      ])
    );
    idxMarks.add(markup.end + 1);
  });

  let renderedText = "";
  let segStart = 0;
  const sortedIdxMarks = Array.from(idxMarks).sort((a, b) => a - b);

  for (const segEnd of sortedIdxMarks) {
    const eventInCurr = eventsMap.get(segEnd);
    renderedText += blockNode.text.substring(segStart, segEnd);

    eventInCurr &&
      eventInCurr.forEach((event) => {
        if (event.event === "start") {
          renderedText += event.relatedMarkup.startTag;
        } else {
          renderedText += event.relatedMarkup.closeTag;
        }
      });

    segStart = segEnd;
  }

  renderedText += blockNode.text.substring(segStart);
  return renderedText;
}
