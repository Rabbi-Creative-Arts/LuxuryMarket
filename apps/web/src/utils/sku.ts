function randomLetters(length: number): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return Array.from({ length }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join("");
}

function randomNumbers(length: number): string {
  const numbers = "0123456789";

  return Array.from({ length }, () =>
    numbers[Math.floor(Math.random() * numbers.length)]
  ).join("");
}

export function generateSKU(prefix = "LM"): string {
  return `${prefix}-${randomLetters(3)}-${randomNumbers(5)}`;
}
