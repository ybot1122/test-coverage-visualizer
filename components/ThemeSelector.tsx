import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "./ThemeContext";
import { syntaxHighlighterThemes } from "@/types/SyntaxHighlighterThemes";

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  return (
    <label className="mr-2 text-sm">
      <span className="pr-2">Preferred Theme:</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="p-2 border rounded cursor-pointer"
      >
        {syntaxHighlighterThemes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
}
export default ThemeSelector;
