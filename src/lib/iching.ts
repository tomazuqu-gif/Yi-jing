export type LineValue = 6 | 7 | 8 | 9;

export const isChangingLine = (v: number): boolean => v === 6 || v === 9;
export const isYangLine = (v: number): boolean => v === 7 || v === 9;

export type Focus = "body" | "emotions" | "thoughts";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export {
  linesToHexagramNumber,
  transformedHexagramNumber,
  normalizeLines,
} from "./casting";
