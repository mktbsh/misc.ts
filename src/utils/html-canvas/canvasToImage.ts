import { canvasResize } from "./resize";
import type { ImageOptions } from "./types";

export async function canvasToImage<T extends "blob" | "dataURL">(
  canvas: HTMLCanvasElement,
  output: T,
  options?: ImageOptions,
): Promise<T extends "blob" ? Blob : string> {
  const type = options?.type ? `image/${options.type}` : undefined;
  const quality = options?.quality;

  if (options?.resize) {
    canvasResize(canvas, options.resize);
  }

  return new Promise<T extends "blob" ? Blob : string>((resolve, reject) => {
    try {
      if (output === "blob") {
        canvas.toBlob(
          (b) =>
            b
              ? resolve(b as T extends "blob" ? Blob : string)
              : reject("Failed to convert canvas to blob"),
          type,
          quality,
        );
      }
      if (output === "dataURL") {
        const dataURL = canvas.toDataURL(type, quality);
        resolve(dataURL as T extends "blob" ? Blob : string);
      }
    } catch (e) {
      reject(e);
    }
  });
}
