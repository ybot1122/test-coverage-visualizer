// Helper to split Windows and POSIX paths into parts
function splitPath(filePath: string) {
  return filePath.split(/[/]+/);
}

// Find common path prefix among Windows/POSIX paths
export function getCommonPathPrefix(paths: string[]): string {
  if (!paths.length) return "";
  const splitPaths = paths.map(splitPath);
  const minLen = Math.min(...splitPaths.map((p) => p.length));
  let prefix: string[] = [];
  for (let i = 0; i < minLen; i++) {
    const segment = splitPaths[0][i];
    if (splitPaths.every((parts) => parts[i] === segment)) {
      prefix.push(segment);
    } else {
      break;
    }
  }
  return prefix.join("/");
}
