import { classes } from "../libs/classes";

describe("a utility that return classNames conditionally", () => {
  it("should return an empty string if no arguments are passed", () => {
    expect(classes()).toBe("");
  });

  it("should return an empty string if all arguments are falsey", () => {
    expect(classes("", false, null, undefined)).toBe("");
  });

  it("should return a string with all truthy arguments", () => {
    expect(classes(true && "carot", "foo", "bar")).toBe("carot foo bar");
  });
});
