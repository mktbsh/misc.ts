const DELIMITER_REGEX = /\r?\n/;
const EMPTY_STR = "";

/**
 * A TransformStream that splits incoming Uint8Array chunks into lines of text.
 * This transform handles both \n and \r\n line endings.
 *
 * The stream:
 * - Decodes incoming Uint8Array chunks into text using TextDecoder
 * - Buffers partial lines until a complete line is received
 * - Outputs complete lines as they are received
 * - Outputs any remaining buffered content when the stream is closed
 */
export class LineSplitTransform extends TransformStream<Uint8Array, string> {
  constructor() {
    let buffer = EMPTY_STR;
    const decoder = new TextDecoder();

    super({
      transform(chunk, ctrl) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split(DELIMITER_REGEX);
        buffer = lines.pop() || EMPTY_STR;

        for (const line of lines) {
          ctrl.enqueue(line);
        }
      },
      flush(ctrl) {
        buffer += decoder.decode();
        if (buffer.length) {
          ctrl.enqueue(buffer);
        }
      },
    });
  }
}
