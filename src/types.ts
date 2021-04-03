export type Markup = {
  // Index where Markup starts, 1-based
  start: number;
  // Index where Markup ends, 1-based
  end: number;
  // Content of starting tag, like <span class="foo bar">
  startTag: string;
  // Type of Tag, like span
  type: string; 
};

export type BlockNode = {
  text: string;
  markups: Markup[];
};
