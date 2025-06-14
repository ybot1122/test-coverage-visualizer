import { useState } from "react";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { themeMap, useTheme } from "./ThemeContext";
import { fetchStream } from "@/utils/fetchStream";

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
    await fetchStream({
      url: `/test_recommendation?path=${filePath}&ref=main`,
      onRead: setResponse,
    });
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col p-2">
      {isLoading ? (
        "responding..."
      ) : (
        <div className="grid gap-2 grid-cols-3">
          <button
            onClick={fetchRec}
            className="border-1 border-black cursor-pointer"
          >
            Suggest Tests
          </button>
          <button
            onClick={fetchRec}
            className="border-1 border-black cursor-pointer"
          >
            Summarize File
          </button>
        </div>
      )}
      <div className="border-1 border-gray-300 m-5 p-5">
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
