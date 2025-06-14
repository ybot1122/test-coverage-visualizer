// Helper to split Windows and POSIX paths into parts
export function splitPath(filePath: string) {
  return filePath.split(/[/\\]+/);
}
