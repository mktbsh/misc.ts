import { describe, it, expect } from "vitest";
import { fileSize } from "./fileSize";

describe("fileSize", () => {
  it("should convert bytes to human-readable format", () => {
    expect(fileSize(0)).toBe("0 B");
    expect(fileSize(1023)).toBe("1023.00 B");
    expect(fileSize(1024)).toBe("1.00 KB");
    expect(fileSize(1048576)).toBe("1.00 MB");
    expect(fileSize(1073741824)).toBe("1.00 GB");
    expect(fileSize(1099511627776)).toBe("1.00 TB");
    expect(fileSize(1125899906842624)).toBe("1.00 PB");
  });

  it("should handle decimal places correctly", () => {
    expect(fileSize(1500, 0)).toBe("1 KB");
    expect(fileSize(1500, 1)).toBe("1.5 KB");
    expect(fileSize(1500, 2)).toBe("1.46 KB");
    expect(fileSize(1500, 3)).toBe("1.465 KB");
  });

  it("should handle Blob objects", () => {
    const blob = new Blob(["Hello, world!"], { type: "text/plain" });
    console.log(blob.size);
    expect(fileSize(blob)).toBe("13.00 B");
  });

  it("should handle large file sizes with bigint", () => {
    expect(fileSize(1125899906842624n)).toBe("1.00 PB");
    expect(fileSize(1152921504606846976n)).toBe("1024.00 PB");
  });

  it("should handle negative numbers and bigints", () => {
    expect(fileSize(-1024)).toBe("-1.00 KB");
    expect(fileSize(-1048576)).toBe("-1.00 MB");
    expect(fileSize(-1099511627776n)).toBe("-1.00 TB");
  });

  it("should handle zero correctly", () => {
    expect(fileSize(0)).toBe("0 B");
    expect(fileSize(0n)).toBe("0 B");
  });
});
