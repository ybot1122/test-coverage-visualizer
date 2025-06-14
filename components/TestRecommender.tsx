import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { themeMap, useTheme } from "./ThemeContext";

export const TestRecommender = ({
  filePath,
  language,
}: {
  filePath: string;
  language: string;
}) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const fetchRec = async () => {
    setIsLoading(true);
    const res = await fetch(`/test_recommendation?path=${filePath}&ref=main`);
    const data = await res.json();

    if (data.msg && data.msg.content.length > 0) {
      setResponse(data.msg.content[0].text);
    } else {
      setResponse("something went wrong");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-row">
      {isLoading ? (
        "generating tests..."
      ) : (
        <div>
          <button onClick={fetchRec} className="border-1 border-black">
            Suggest Tests
          </button>
        </div>
      )}
      <div>
        <SyntaxHighlighter
          language={language}
          showLineNumbers
          showInlineLineNumbers
          style={themeMap[theme]}
          lineProps={(lineNumber) => {
            return {
              key: lineNumber,
              id: `line-${lineNumber}`,
            };
          }}
          wrapLines
        >
          {response}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
