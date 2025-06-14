export const fetchStream = async ({
  url,
  onRead,
}: {
  url: string;
  onRead: (s: string) => void;
}) => {
  const response = await fetch(url);

  if (!response.body) {
    onRead("Error failed to make call");
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
      accumulated += chunk;

      onRead(accumulated);
    }
  }
};
