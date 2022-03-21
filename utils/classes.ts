/**
 * Given an array of strings, return a string that concatenates all of the strings with spaces in
 * between
 * @param {(string | boolean | null | undefined)[]} arr - (string | boolean | null | undefined)[]
 * @returns A string.
 */
export function classes(
  ...arr: (string | boolean | null | undefined)[]
): string {
  return arr.join(" ");
}
