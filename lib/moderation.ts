const BLOCKED_WORDS = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "idiot",
  "moron",
  "nazi",
] as const;

function normalizeForModeration(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function containsProfanity(input: string): boolean {
  const normalized = normalizeForModeration(input);
  return BLOCKED_WORDS.some((word) => {
    const pattern = new RegExp(`\\b${word}\\b`, "i");
    return pattern.test(normalized);
  });
}

export function isCommentLengthValid(input: string): boolean {
  const length = input.trim().length;
  return length >= 1 && length <= 600;
}
