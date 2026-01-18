const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const TXT_PATH = path.join(PROJECT_ROOT, 'assets', 'V2.8.5.txt');
const OUT_DIR = path.join(PROJECT_ROOT, 'app', 'data');

function isStringDelimiter(ch) {
  return ch === '"' || ch === "'" || ch === '`';
}

function extractLiteral(src, varName) {
  const idx = src.indexOf(`const ${varName}`);
  if (idx < 0) return null;
  const eq = src.indexOf('=', idx);
  if (eq < 0) return null;
  let i = eq + 1;
  while (i < src.length && /\s/.test(src[i])) i++;

  const startCh = src[i];
  if (startCh !== '{' && startCh !== '[') {
    // try to handle inline JSON object on same line (still { or [ expected)
    return null;
  }

  const open = startCh;
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  let inStr = false;
  let strDelim = '';
  let escaped = false;
  const start = i;

  for (; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === strDelim) {
        inStr = false;
        strDelim = '';
      }
      continue;
    }

    if (isStringDelimiter(ch)) {
      inStr = true;
      strDelim = ch;
      continue;
    }

    if (ch === open) depth++;
    if (ch === close) depth--;

    if (depth === 0) {
      const end = i + 1;
      return src.slice(start, end);
    }
  }
  return null;
}

function writeTS(name, exportName, literal, isArray) {
  const header = `// Auto-generated from assets/V2.8.5.txt\n// DO NOT EDIT BY HAND\n`;
  const body = `export const ${exportName} = ${literal};\n`;
  fs.writeFileSync(path.join(OUT_DIR, name), header + body, 'utf8');
}

function main() {
  if (!fs.existsSync(TXT_PATH)) {
    console.error('TXT not found:', TXT_PATH);
    process.exit(1);
  }
  const src = fs.readFileSync(TXT_PATH, 'utf8');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const targets = [
    { varName: 'PI_REQUIREMENTS', file: 'piRequirements.ts', exportName: 'PI_REQUIREMENTS' },
    { varName: 'COUNTRY_LIST', file: 'countryList.ts', exportName: 'COUNTRY_LIST' },
    { varName: 'RESIDENT_LOADING', file: 'residentLoading.ts', exportName: 'RESIDENT_LOADING' },
    { varName: 'OCCUPATION_DB', file: 'occupationDb.ts', exportName: 'OCCUPATION_DB' },
    { varName: 'MASTER_BROKER_DATA', file: 'masterBrokerData.ts', exportName: 'MASTER_BROKER_DATA' },
    { varName: 'PENDING_MESSAGES', file: 'pendingMessages.ts', exportName: 'PENDING_MESSAGES' },
    { varName: 'SUPP_BENEFIT_LOADING_RULE', file: 'suppBenefitRuleData.ts', exportName: 'SUPP_BENEFIT_LOADING_RULE' },
  ];

  let ok = 0;
  for (const t of targets) {
    const lit = extractLiteral(src, t.varName);
    if (!lit) {
      console.warn('WARN: could not extract', t.varName);
      continue;
    }
    writeTS(t.file, t.exportName, lit);
    ok++;
  }

  console.log(`Done. Extracted ${ok}/${targets.length} constants into app/data/`);
}

main();
