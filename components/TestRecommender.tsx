import { useState } from "react";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { themeMap, useTheme } from "./ThemeContext";

export const TestRecommender = ({
  filePath,
  language,
}: {
  filePath: string;
  language: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const { theme } = useTheme();

  const fetchRec = async () => {
    setIsLoading(true);
    setResponse("");
    const response = await fetch(
      `/test_recommendation?path=${filePath}&ref=main`
    );

    if (!response.body) {
      setResponse("Error failed to make call");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let accumulated = "";

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        console.log(chunk);
        accumulated += chunk;

        if (accumulated.startsWith("```typescript")) {
          accumulated.replace("```typescript", "");
        }

        setResponse(accumulated);
      }
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
        <Markdown
          components={{
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  PreTag="div"
                  children={String(children).replace(/\n$/, "")}
                  language={match[1]}
                  style={themeMap[theme]}
                />
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {response}
        </Markdown>
      </div>
    </div>
  );
};
