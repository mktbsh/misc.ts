import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { headlessFilePicker } from "./headlessFilePicker";

describe("headlessFilePicker", () => {
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    inputElement = document.createElement("input");
    vi.spyOn(document, "createElement").mockReturnValue(inputElement);
    vi.spyOn(inputElement, "click").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create an input element with correct attributes", async () => {
    const promise = headlessFilePicker({ accept: ".txt", multiple: true });

    expect(inputElement.type).toBe("file");
    expect(inputElement.accept).toBe(".txt");
    expect(inputElement.multiple).toBe(true);

    // Simulate file selection
    Object.defineProperty(inputElement, "files", {
      value: { length: 1 } as FileList,
    });
    inputElement.onchange?.({} as Event);

    await expect(promise).resolves.toEqual({ length: 1 });
  });

  it("should use default options when not provided", async () => {
    const promise = headlessFilePicker();

    expect(inputElement.accept).toBe("*");
    expect(inputElement.multiple).toBe(false);

    // Simulate file selection
    Object.defineProperty(inputElement, "files", {
      value: { length: 1 } as FileList,
    });
    inputElement.onchange?.({} as Event);

    await expect(promise).resolves.toEqual({ length: 1 });
  });

  it("should reject when no files are selected", async () => {
    const promise = headlessFilePicker();

    // Simulate no file selection
    Object.defineProperty(inputElement, "files", {
      value: null,
    });
    inputElement.onchange?.({} as Event);

    await expect(promise).rejects.toThrow("No files selected");
  });
});
