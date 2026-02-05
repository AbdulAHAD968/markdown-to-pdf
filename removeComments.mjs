import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skipDirs = new Set([
  "node_modules",
  ".next",
  "out",
  "build",
  "dist",
  ".git",
  "coverage",
  ".venv",
  "__pycache__"
]);

const targetExtensions = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py"
]);

/* =========================
   JS / TS COMMENT STRIPPER
   (UNCHANGED FROM YOUR SCRIPT)
   ========================= */

function stripComments(code) {
  code = code.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "");

  let result = "";
  let i = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let inLineComment = false;
  let inBlockComment = false;
  let inRegex = false;

  while (i < code.length) {
    const char = code[i];
    const nextChar = code[i + 1] || "";
    const prevChar = i > 0 ? code[i - 1] : "";

    if (inLineComment) {
      if (char === "\n") {
        inLineComment = false;
        result += "\n";
      }
      i++;
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && nextChar === "/") {
        inBlockComment = false;
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    if (inRegex) {
      result += char;
      if (char === "/" && prevChar !== "\\") {
        inRegex = false;
      }
      i++;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && !inBacktick && !inRegex) {
      if (char === "/" && nextChar === "/") {
        inLineComment = true;
        i += 2;
        continue;
      }

      if (char === "/" && nextChar === "*") {
        inBlockComment = true;
        i += 2;
        continue;
      }

      if (char === "'") {
        inSingleQuote = true;
        result += char;
        i++;
        continue;
      }

      if (char === '"') {
        inDoubleQuote = true;
        result += char;
        i++;
        continue;
      }

      if (char === "`") {
        inBacktick = true;
        result += char;
        i++;
        continue;
      }

      if (char === "/" && /[\s=(\[{:;!&|?+\-*%^~,]/.test(prevChar || " ")) {
        inRegex = true;
        result += char;
        i++;
        continue;
      }
    } else {
      if (char === "\\") {
        result += char + nextChar;
        i += 2;
        continue;
      }

      if (
        (inSingleQuote && char === "'") ||
        (inDoubleQuote && char === '"') ||
        (inBacktick && char === "`")
      ) {
        inSingleQuote = false;
        inDoubleQuote = false;
        inBacktick = false;
        result += char;
        i++;
        continue;
      }
    }

    result += char;
    i++;
  }

  return result;
}

/* =========================
   PYTHON COMMENT STRIPPER
   SAFE: removes ONLY # comments
   ========================= */

function stripPythonComments(code) {
  let result = "";
  let i = 0;

  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTripleSingle = false;
  let inTripleDouble = false;

  while (i < code.length) {
    const char = code[i];
    const next3 = code.slice(i, i + 3);

    // Inside triple-quoted strings (docstrings preserved)
    if (inTripleSingle) {
      result += char;
      if (next3 === "'''") {
        result += "''";
        inTripleSingle = false;
        i += 3;
        continue;
      }
      i++;
      continue;
    }

    if (inTripleDouble) {
      result += char;
      if (next3 === '"""') {
        result += '""';
        inTripleDouble = false;
        i += 3;
        continue;
      }
      i++;
      continue;
    }

    // Inside normal strings
    if (inSingleQuote || inDoubleQuote) {
      result += char;
      if (char === "\\" && i + 1 < code.length) {
        result += code[i + 1];
        i += 2;
        continue;
      }

      if (
        (inSingleQuote && char === "'") ||
        (inDoubleQuote && char === '"')
      ) {
        inSingleQuote = false;
        inDoubleQuote = false;
      }

      i++;
      continue;
    }

    // Start triple-quoted strings
    if (next3 === "'''") {
      result += "'''";
      inTripleSingle = true;
      i += 3;
      continue;
    }

    if (next3 === '"""') {
      result += '"""';
      inTripleDouble = true;
      i += 3;
      continue;
    }

    // Start normal strings
    if (char === "'") {
      inSingleQuote = true;
      result += char;
      i++;
      continue;
    }

    if (char === '"') {
      inDoubleQuote = true;
      result += char;
      i++;
      continue;
    }

    // Remove # comments (until newline)
    if (char === "#") {
      while (i < code.length && code[i] !== "\n") i++;
      continue;
    }

    result += char;
    i++;
  }

  return result;
}

/* =========================
   FILE PROCESSING
   ========================= */

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const ext = path.extname(filePath);

    let cleaned = content;

    if (ext === ".py") {
      cleaned = stripPythonComments(content);
    } else {
      cleaned = stripComments(content);
    }

    if (content !== cleaned) {
      fs.writeFileSync(filePath, cleaned, "utf8");
      console.log(`✓ ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}: ${error.message}`);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      walk(fullPath);
    } else {
      const ext = path.extname(entry.name);
      if (targetExtensions.has(ext)) {
        processFile(fullPath);
      }
    }
  }
}

console.log("Starting safe comment removal...");
walk(__dirname);
console.log("Done.");
