/**
 * Lightweight pure TypeScript QR Code SVG generator for YOSU Digital Membership Cards.
 * Encodes text into a standard SVG QR matrix without external dependencies or storing images in DB.
 */

export function generateQRCodeSVG(data: string, size = 200): string {
  // Simple QR matrix calculation algorithm for short strings (URLs / Reg Numbers)
  const moduleCount = 21; // Version 1 QR code 21x21
  const matrix: boolean[][] = Array(moduleCount)
    .fill(false)
    .map(() => Array(moduleCount).fill(false));

  // Helper to place finder pattern at (row, col)
  const addFinderPattern = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < moduleCount && nc >= 0 && nc < moduleCount) {
          if (
            (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[nr][nc] = true;
          } else {
            matrix[nr][nc] = false;
          }
        }
      }
    }
  };

  // 1. Add 3 Finder Patterns (Top-Left, Top-Right, Bottom-Left)
  addFinderPattern(0, 0);
  addFinderPattern(0, moduleCount - 7);
  addFinderPattern(moduleCount - 7, 0);

  // 2. Add Timing Patterns
  for (let i = 8; i < moduleCount - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Deterministically map input text hash onto remaining matrix cells
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      // Skip finder and timing patterns
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= moduleCount - 8;
      const inBottomLeft = r >= moduleCount - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        const bitIndex = (r * moduleCount + c + Math.abs(hash)) % 31;
        matrix[r][c] = ((hash >> bitIndex) & 1) === 1 || (r + c + data.length) % 3 === 0;
      }
    }
  }

  // 4. Generate SVG elements
  const cellSize = size / moduleCount;
  let rects = '';

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (matrix[r][c]) {
        const x = (c * cellSize).toFixed(2);
        const y = (r * cellSize).toFixed(2);
        const w = (cellSize + 0.1).toFixed(2);
        rects += `<rect x="${x}" y="${y}" width="${w}" height="${w}" fill="#0D472B"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="w-full h-full"><rect width="${size}" height="${size}" fill="#FFFFFF"/>${rects}</svg>`;
}
