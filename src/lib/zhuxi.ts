import {
  isChangingLine,
  linesToHexagramNumber,
  transformedHexagramNumber,
  type LineValue,
} from "@/lib/iching";

export type ReadingPriority = "governing" | "supporting";

export type ReadingItem =
  | {
      kind: "judgment";
      hexagramNumber: number;
      priority: ReadingPriority;
    }
  | {
      kind: "line";
      hexagramNumber: number;
      linePosition: number;
      priority: ReadingPriority;
    }
  | {
      kind: "special";
      hexagramNumber: 1 | 2;
      specialText: "useNine" | "useSix";
      priority: ReadingPriority;
    };

export interface ZhuXiReadingPlan {
  method: "zhu-xi-simplified";

  primaryHexagramNumber: number;
  resultingHexagramNumber: number;

  changingPositions: number[];
  unchangedPositions: number[];

  changingLineCount: number;

  ruleTitle: string;
  explanation: string;

  items: ReadingItem[];

  /**
   * Zhu Xi's framework includes a finer distinction
   * for three-changing-line cases. This implementation
   * uses the common simplified version.
   */
  qualification?: string;
}

function validateCast(lines: readonly number[]): void {
  if (lines.length !== 6) {
    throw new Error(
      `A hexagram must contain exactly 6 lines; received ${lines.length}.`
    );
  }

  if (lines.some((value) => ![6, 7, 8, 9].includes(value))) {
    throw new Error(
      "Invalid cast: every line must be 6, 7, 8, or 9."
    );
  }
}

/**
 * Create an interpretation plan using the common,
 * simplified form of Zhu Xi's seven rules.
 *
 * Line positions are numbered from the bottom:
 * position 1 = bottom line
 * position 6 = top line
 */
export function getZhuXiReadingPlan(
  inputLines: readonly LineValue[]
): ZhuXiReadingPlan {
  validateCast(inputLines);

  const lines = [...inputLines];

  const primaryHexagramNumber =
    linesToHexagramNumber(lines);

  const resultingHexagramNumber =
    transformedHexagramNumber(lines);

  const changingPositions = lines
    .map((value, index) => ({
      value,
      position: index + 1,
    }))
    .filter(({ value }) => isChangingLine(value))
    .map(({ position }) => position);

  const unchangedPositions = lines
    .map((value, index) => ({
      value,
      position: index + 1,
    }))
    .filter(({ value }) => !isChangingLine(value))
    .map(({ position }) => position);

  const changingLineCount = changingPositions.length;

  const items: ReadingItem[] = [];

  let ruleTitle = "";
  let explanation = "";
  let qualification: string | undefined;

  switch (changingLineCount) {
    case 0: {
      ruleTitle = "No changing lines";

      explanation =
        "Consult the judgment of the primary hexagram. " +
        "The cast contains no changing lines.";

      items.push({
        kind: "judgment",
        hexagramNumber: primaryHexagramNumber,
        priority: "governing",
      });

      break;
    }

    case 1: {
      ruleTitle = "One changing line";

      const position = changingPositions[0];

      explanation =
        `Consult line ${position} of the primary hexagram.`;

      items.push({
        kind: "line",
        hexagramNumber: primaryHexagramNumber,
        linePosition: position,
        priority: "governing",
      });

      break;
    }

    case 2: {
      ruleTitle = "Two changing lines";

      /*
       * Both changing-line texts belong to the primary
       * hexagram. The upper line takes precedence.
       */
      const [upper, lower] = [...changingPositions]
        .sort((a, b) => b - a);

      explanation =
        `Consult both changing lines in the primary hexagram. ` +
        `Line ${upper}, the upper line, governs; ` +
        `line ${lower} supports it.`;

      items.push(
        {
          kind: "line",
          hexagramNumber: primaryHexagramNumber,
          linePosition: upper,
          priority: "governing",
        },
        {
          kind: "line",
          hexagramNumber: primaryHexagramNumber,
          linePosition: lower,
          priority: "supporting",
        }
      );

      break;
    }

    case 3: {
      ruleTitle = "Three changing lines";

      explanation =
        "Consult the judgments of both hexagrams. " +
        "In this simplified Zhu Xi-style approach, " +
        "the primary hexagram governs and the resulting " +
        "hexagram provides supporting context.";

      items.push(
        {
          kind: "judgment",
          hexagramNumber: primaryHexagramNumber,
          priority: "governing",
        },
        {
          kind: "judgment",
          hexagramNumber: resultingHexagramNumber,
          priority: "supporting",
        }
      );

      qualification =
        "This is the simplified three-line rule. " +
        "Zhu Xi's framework also records a finer distinction " +
        "in which the relative precedence of the two judgments " +
        "can differ. That refinement is not implemented here.";

      break;
    }

    case 4: {
      ruleTitle = "Four changing lines";

      /*
       * Consult the two unchanged lines in the resulting
       * hexagram. The lower line takes precedence.
       */
      const [lower, upper] = [...unchangedPositions]
        .sort((a, b) => a - b);

      explanation =
        `Consult the two unchanged lines in the resulting ` +
        `hexagram. Line ${lower}, the lower line, governs; ` +
        `line ${upper} supports it.`;

      items.push(
        {
          kind: "line",
          hexagramNumber: resultingHexagramNumber,
          linePosition: lower,
          priority: "governing",
        },
        {
          kind: "line",
          hexagramNumber: resultingHexagramNumber,
          linePosition: upper,
          priority: "supporting",
        }
      );

      break;
    }

    case 5: {
      ruleTitle = "Five changing lines";

      const position = unchangedPositions[0];

      explanation =
        `Consult the one unchanged line, at position ${position}, ` +
        `in the resulting hexagram.`;

      items.push({
        kind: "line",
        hexagramNumber: resultingHexagramNumber,
        linePosition: position,
        priority: "governing",
      });

      break;
    }

    case 6: {
      /*
       * Special texts apply when all six lines change in
       * Hexagram 1 or Hexagram 2.
       */
      if (
        primaryHexagramNumber === 1 &&
        lines.every((value) => value === 9)
      ) {
        ruleTitle = "All six lines changing in Hexagram 1";

        explanation =
          "Consult the special 'Use of Nine' text for " +
          "Hexagram 1. The resulting hexagram's judgment " +
          "provides supporting context.";

        items.push(
          {
            kind: "special",
            hexagramNumber: 1,
            specialText: "useNine",
            priority: "governing",
          },
          {
            kind: "judgment",
            hexagramNumber: resultingHexagramNumber,
            priority: "supporting",
          }
        );
      } else if (
        primaryHexagramNumber === 2 &&
        lines.every((value) => value === 6)
      ) {
        ruleTitle = "All six lines changing in Hexagram 2";

        explanation =
          "Consult the special 'Use of Six' text for " +
          "Hexagram 2. The resulting hexagram's judgment " +
          "provides supporting context.";

        items.push(
          {
            kind: "special",
            hexagramNumber: 2,
            specialText: "useSix",
            priority: "governing",
          },
          {
            kind: "judgment",
            hexagramNumber: resultingHexagramNumber,
            priority: "supporting",
          }
        );
      } else {
        ruleTitle = "All six lines changing";

        explanation =
          "Consult the judgment of the resulting hexagram.";

        items.push({
          kind: "judgment",
          hexagramNumber: resultingHexagramNumber,
          priority: "governing",
        });
      }

      break;
    }

    default: {
      // Unreachable after validating six line values.
      throw new Error(
        `Unexpected number of changing lines: ${changingLineCount}`
      );
    }
  }

  return {
    method: "zhu-xi-simplified",
    primaryHexagramNumber,
    resultingHexagramNumber,
    changingPositions,
    unchangedPositions,
    changingLineCount,
    ruleTitle,
    explanation,
    items,
    qualification,
  };
}
