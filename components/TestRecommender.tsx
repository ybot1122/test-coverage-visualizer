import { useState } from "react";
import Markdown from "react-markdown";

export const TestRecommender = ({
  filePath,
  language,
}: {
  filePath: string;
  language: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

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
        <Markdown>{response}</Markdown>
      </div>
    </div>
  );
};
