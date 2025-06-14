export const buildFileKey = (path: string, filename: string) => {
  let result = "";

  // strip leading slash if it is there
  if (path.startsWith("/")) {
    result += path;
  } else {
    result += "/" + path;
  }

  if (filename) {
    if (!filename.startsWith("/")) {
      result += "/" + filename;
    } else {
      result += filename;
    }
  }

  // strip trailing slash if it is there
  if (result.endsWith("/")) {
    result = result.slice(0, result.length - 1);
  }

  if (result.startsWith("//")) {
    result = result.slice(1, result.length);
  }

  return result;
};
