export type Markup = {
  start: number;
  end: number;
  startTag: string;
  type: string;
};

export type BlockNode = {
  text: string;
  markups: Markup[];
};
