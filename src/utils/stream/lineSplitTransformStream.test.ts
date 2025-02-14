import { describe, expect, it } from "vitest";
import { LineSplitTransform } from "./lineSplitTransformStream";

describe("LineSplitTransform", () => {
  it("should split single chunk with multiple lines", async () => {
    const input = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("line1\nline2\nline3"));
        controller.close();
      },
    });

    const resultStream = input.pipeThrough(new LineSplitTransform());
    const reader = resultStream.getReader();

    const lines: string[] = [];
    let result = await reader.read();
    while (!result.done) {
      lines.push(result.value);
      result = await reader.read();
    }

    expect(lines).toEqual(["line1", "line2", "line3"]);
  });

  it("should handle CRLF line endings", async () => {
    const input = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("line1\r\nline2\r\nline3"));
        controller.close();
      },
    });

    const resultStream = input.pipeThrough(new LineSplitTransform());
    const reader = resultStream.getReader();

    const lines: string[] = [];
    let result = await reader.read();
    while (!result.done) {
      lines.push(result.value);
      result = await reader.read();
    }

    expect(lines).toEqual(["line1", "line2", "line3"]);
  });

  it("should handle multiple chunks", async () => {
    const input = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("li"));
        controller.enqueue(new TextEncoder().encode("ne1\nli"));
        controller.enqueue(new TextEncoder().encode("ne2\nline3"));
        controller.close();
      },
    });

    const resultStream = input.pipeThrough(new LineSplitTransform());
    const reader = resultStream.getReader();

    const lines: string[] = [];
    let result = await reader.read();
    while (!result.done) {
      lines.push(result.value);
      result = await reader.read();
    }

    expect(lines).toEqual(["line1", "line2", "line3"]);
  });

  it("should handle empty lines", async () => {
    const input = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("line1\n\nline3"));
        controller.close();
      },
    });

    const resultStream = input.pipeThrough(new LineSplitTransform());
    const reader = resultStream.getReader();

    const lines: string[] = [];
    let result = await reader.read();
    while (!result.done) {
      lines.push(result.value);
      result = await reader.read();
    }

    expect(lines).toEqual(["line1", "", "line3"]);
  });
});
