export const syntaxHighlighterThemes = [
  "docco",
  "ascetic",
  "darcula",
  "dark",
  "github",
  "hopscotch",
  "idea",
  "nightOwl",
  "ocean",
  "sunburst",
  "vs2015",
] as const;

export type SyntaxHighlighterTheme = (typeof syntaxHighlighterThemes)[number];
