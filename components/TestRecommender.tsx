import { useState } from "react";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { themeMap, useTheme } from "./ThemeContext";
import { fetchStream } from "@/utils/fetchStream";
import { Outfit } from "next/font/google";
import { LineInfo } from "./LineInfo";
import { useLineInfo } from "./LineContext";
import { useCoverageData } from "./CoverageDataContext";
import Loader from "./Loader";
import { SuggestTestsButton } from "./SuggestTestsButton";

const loaderCopy = {
  summarize_file: "Generating summary of this file...",
  test_file: "Generating tests for this file...",
  summarize_line: "Explaining the coverage for this line",
  test_line: "Generating test to cover this line",
};

const font = Outfit({
  weight: "400",
  subsets: ["latin"],
});

export const TestRecommender = ({
  filePath,
  language,
}: {
  filePath: string;
  language: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [testFramework, setTestFramework] = useState("jest");
  const { theme } = useTheme();
  const { lineInfo, setLineInfo } = useLineInfo();
  const [currAction, setCurrAction] = useState<
    "summarize_file" | "test_file" | "summarize_line" | "test_line"
  >();
  const { coverageMap } = useCoverageData();

  const updateTestFramework = (event: any) => {
    setTestFramework(event.target.value);
  };

  const fetchRec = async () => {
    setIsLoading(true);
    setCurrAction("test_file");
    setResponse("");
    await fetchStream({
      url: `/test_recommendation?path=${filePath}&ref=main&framework=${testFramework}`,
      onRead: setResponse,
    });
    setIsLoading(false);
  };

  const fetchSummary = async () => {
    setIsLoading(true);
    setCurrAction("summarize_file");
    setResponse("");
    await fetchStream({
      url: `/summarize_file?path=${filePath}&ref=main`,
      onRead: setResponse,
    });
    setIsLoading(false);
  };

  const fetchLineExplanation = async () => {
    setIsLoading(true);
    setCurrAction("summarize_line");
  };

  const fetchTestForLine = async () => {
    setIsLoading(true);
    setCurrAction("test_line");
  };

  return (
    <div className="flex flex-col p-2 t-[20px]">
      <LineInfo filePath={filePath} />
      {isLoading && currAction ? (
        <div className="text-center">
          {loaderCopy[currAction]} <Loader />
        </div>
      ) : !lineInfo ? (
        <div className="grid gap-2 grid-cols-2">
          <SuggestTestsButton
            onClick={fetchRec}
            updateTestFramework={updateTestFramework}
            testFramework={testFramework}
            label={"Generate Tests for File"}
          />
          <button
            onClick={fetchSummary}
            className="border-1 border-black cursor-pointer  h-[100px] hover:bg-gray-300"
          >
            Summarize File
          </button>
        </div>
      ) : (
        <div className="grid gap-2 grid-cols-2 mt-2">
          <SuggestTestsButton
            onClick={fetchRec}
            updateTestFramework={updateTestFramework}
            testFramework={testFramework}
            label={"Generate Tests for Line"}
          />
          <button
            onClick={fetchRec}
            className="border-1 border-black cursor-pointer h-[100px]  hover:bg-gray-300"
          >
            Explain Coverage for this Line
          </button>
        </div>
      )}
      <div
        className={`${
          response ? "border-1" : ""
        } border-gray-300 mt-5 p-5 *:mb-2 ${font.className} markdown`}
      >
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
                  wrapLongLines
                  wrapLines
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
