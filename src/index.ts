import { BlockNode } from "./types";
import { parseHTMLElementToBlockNode } from "./parser";

function createFragmentFromStr(htmlStr: string) {
  const fragment = document.createElement("div");
  fragment.innerHTML = htmlStr;
  return fragment;
}

export function parseHTMLStringToNode(htmlStr: string): BlockNode {
  const fragment = createFragmentFromStr(htmlStr);
  return parseHTMLElementToBlockNode(fragment);
}
