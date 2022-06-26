import { formatBytes } from "../libs/formatBytes";

describe("a utility that formats bytes into human-readable size", () => {
  //   it("should throw an error if no bytes", async () => {
  //     await expect(formatBytes(undefined)).rejects.toThrow("bytes is required");
  //   });

  it("should return 0 Bytes if bytes is 0", async () => {
    expect(formatBytes(0)).toBe("0 Bytes");
  });
});
