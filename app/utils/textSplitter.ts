export type SplitRow = { prefixType: 'pending' | 'fyi' | 'none'; customPrefix: string; textA: string; textB: string };

export function splitBulkTextIntoSegments(input: string): string[] {
  const t = (input || '').trim();
  if (!t) return [];
  // matches TXT: split by new line + digits + dot (e.g. \n1.)
  const segments = t.split(/\n\s*(?=\d+\.)/).map((s) => s.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
  return segments.length ? segments : [t];
}

export function wrapTextByLength(text: string, lineLength: number): string[] {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length <= lineLength) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function buildExcelBlocks(params: {
  bulkTextA: string;
  lineLength: number;
  rowLimit: number;
  firstColRowLimit?: number | null;
}): Array<{ row: number; block: number; textA: string; textB: string }> {
  const { bulkTextA, lineLength, rowLimit, firstColRowLimit } = params;
  const segments = splitBulkTextIntoSegments(bulkTextA);
  const out: Array<{ row: number; block: number; textA: string; textB: string }> = [];

  let currentRow = 1;
  let block = 0;

  for (let i = 0; i < segments.length; i++) {
    const lines = wrapTextByLength(segments[i], lineLength);
    for (const line of lines) {
      const limit = block === 0 && firstColRowLimit ? firstColRowLimit : rowLimit;
      if (currentRow > limit) {
        block += 1;
        currentRow = 1;
      }
      out.push({ row: currentRow, block, textA: line, textB: '' });
      currentRow += 1;
    }
  }
  return out;
}

export function buildFollowUpText(textA: string, textB: string, idx1Based: number): string {
  // TXT: `TextB ${idx} 00 L ${TextA}`
  const n = String(idx1Based).padStart(1, '');
  return `${textB} ${n} 00 L ${textA}`.trim();
}
