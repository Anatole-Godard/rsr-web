export function classes(
  ...arr: (string | boolean | null | undefined)[]
): string {
  return arr.join(" ");
}
