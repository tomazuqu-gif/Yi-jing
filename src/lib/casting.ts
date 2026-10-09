const BINARY_TO_HEXAGRAM: Record<string, number> = {
  "000000": 2,
  "000001": 23,
  "000010": 8,
  "000011": 20,
  "000100": 16,
  "000101": 35,
  "000110": 45,
  "000111": 12,
  "001000": 15,
  "001001": 52,
  "001010": 39,
  "001011": 53,
  "001100": 62,
  "001101": 56,
  "001110": 31,
  "001111": 33,
  "010000": 7,
  "010001": 4,
  "010010": 29,
  "010011": 59,
  "010100": 40,
  "010101": 64,
  "010110": 47,
  "010111": 6,
  "011000": 46,
  "011001": 18,
  "011010": 48,
  "011011": 57,
  "011100": 32,
  "011101": 50,
  "011110": 28,
  "011111": 44,
  "100000": 24,
  "100001": 27,
  "100010": 3,
  "100011": 42,
  "100100": 51,
  "100101": 21,
  "100110": 17,
  "100111": 25,
  "101000": 36,
  "101001": 22,
  "101010": 63,
  "101011": 37,
  "101100": 55,
  "101101": 30,
  "101110": 49,
  "101111": 13,
  "110000": 19,
  "110001": 41,
  "110010": 60,
  "110011": 61,
  "110100": 54,
  "110101": 38,
  "110110": 58,
  "110111": 10,
  "111000": 11,
  "111001": 26,
  "111010": 5,
  "111011": 9,
  "111100": 34,
  "111101": 14,
  "111110": 43,
  "111111": 1,
};

// Valid coin-casting values:
// 6 = changing yin
// 7 = stable yang
// 8 = stable yin
// 9 = changing yang
//
// Lines must be ordered bottom-to-top.

function validateLines(lines: readonly number[]): void {
  if (lines.length !== 6) {
    throw new Error(
      `Expected exactly 6 lines, received ${lines.length}.`
    );
  }

  if (lines.some((v) => ![6, 7, 8, 9].includes(v))) {
    throw new Error(
      "Each line must have a value of 6, 7, 8, or 9."
    );
  }
}

function linesToBinary(lines: readonly number[]): string {
  validateLines(lines);

  return lines
    .map((v) => (v === 7 || v === 9 ? "1" : "0"))
    .join("");
}

export function linesToHexagramNumber(
  lines: readonly number[]
): number {
  const binary = linesToBinary(lines);
  const hexagram = BINARY_TO_HEXAGRAM[binary];

  if (hexagram === undefined) {
    throw new Error(`Unknown hexagram pattern: ${binary}`);
  }

  return hexagram;
}

// Convert changing lines into their resulting stable polarity.
// Stable lines remain unchanged.
export function normalizeLines(
  lines: readonly number[]
): number[] {
  validateLines(lines);

  return lines.map((v) =>
    v === 6 ? 7 :
    v === 9 ? 8 :
    v
  );
}

export function transformedHexagramNumber(
  lines: readonly number[]
): number {
  return linesToHexagramNumber(normalizeLines(lines));
}
