import { getPagination, getTotalPages } from "@utils/pagination";

describe("a function that return a pagination object", () => {
  it("should return a pagination object", () => {
    const pagination = getPagination(1, 10);
    expect(pagination).toEqual({ limit: 10, offset: 0 });
  });

  it("should return a pagination object with a different offset", () => {
    const pagination = getPagination(2, 10);
    expect(pagination).toEqual({ limit: 10, offset: 10 });
  });

  it("should return a pagination object with a different limit", () => {
    const pagination = getPagination(1, 20);
    expect(pagination).toEqual({ limit: 20, offset: 0 });
  });

  it("should return default pagination object", () => {
    const pagination = getPagination();
    expect(pagination).toEqual({ limit: 1000, offset: 0 });
  });

  it("should throw an error if currentPage is not a number", () => {
    expect(() => getPagination("a", 10)).toThrowError(
      "currentPage must be a number or stringified number"
    );
  });
});

describe("a function that return the total number of pages", () => {
  it("should return the total number of pages", () => {
    expect(getTotalPages(10, 10)).toEqual(1);
    expect(getTotalPages(1000, 100)).toEqual(10);
    expect(getTotalPages(100, 1)).toEqual(100);
  });
});
