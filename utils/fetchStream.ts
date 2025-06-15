export const fetchStream = async ({
  url,
  onRead,
  reqId,
}: {
  url: string;
  onRead: (reqId: number, s: string) => void;
  reqId: number;
}) => {
  const response = await fetch(url);

  if (!response.body) {
    onRead(reqId, "Error failed to make call");
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

      onRead(reqId, accumulated);
    }
  }
};
