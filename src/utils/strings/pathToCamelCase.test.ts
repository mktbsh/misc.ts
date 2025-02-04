import { describe, expect, it } from "vitest";
import { pathToCamelCase } from "./pathToCamelCase";

describe("pathToCamelCase", () => {
  it("should convert a path to camelCase", () => {
    expect(pathToCamelCase("/application/info")).toBe("applicationInfo");
    expect(pathToCamelCase("/folder/create")).toBe("folderCreate");
    expect(pathToCamelCase("/user/profile/edit")).toBe("userProfileEdit");
  });

  it("should handle paths with single segment", () => {
    expect(pathToCamelCase("/home")).toBe("home");
  });

  it("should handle empty paths", () => {
    expect(pathToCamelCase("")).toBe("");
  });
});
