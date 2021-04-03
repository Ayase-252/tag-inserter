export function extractOpeningTagFromElement(elem: HTMLElement): string {
  const START_TAG_REGEX = /<[a-z]+.*?>/;
  const outerHTML = elem.outerHTML;
  const startTagMatch = START_TAG_REGEX.exec(outerHTML);
  if (startTagMatch === null) {
    console.error("Cannot find start tag for node", outerHTML);
    throw new Error("Cannot find start tag for node");
  }
  return startTagMatch[0];
}
