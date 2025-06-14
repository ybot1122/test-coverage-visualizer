export function getAllFiles(coverageMap: { [filename: string]: any }) {
  const response = Object.keys(coverageMap);
  return response.filter((file) => file !== "total").sort();
}
