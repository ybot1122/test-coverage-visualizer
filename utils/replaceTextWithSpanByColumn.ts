export function replaceTextWithSpanByColumn(
  elementId: string,
  colStart: number,
  colEnd: number,
) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Get the whole text content
  const text = el.textContent;
  console.log(text);

  if (!text) {
    return;
  }

  if (colStart < 0 || colEnd > text.length || colStart >= colEnd) return;

  // Split text into three parts: before, target, after
  const offsetStart = colStart + 2;
  const offsetEnd = colEnd === 10000 ? text.length : colEnd + 2;
  const before = text.slice(0, offsetStart);
  const target = text.slice(offsetStart, offsetEnd);
  const after = text.slice(offsetEnd);

  // Create span
  const span = document.createElement("span");
  span.textContent = target;
  span.style.background = "yellow"; // for demo

  // Clear element and append nodes
  el.textContent = "";
  if (before) el.appendChild(document.createTextNode(before));
  el.appendChild(span);
  if (after) el.appendChild(document.createTextNode(after));
}
