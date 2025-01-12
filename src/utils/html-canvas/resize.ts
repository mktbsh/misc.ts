import { ctx2d } from "./context";
import type { ResizeOption } from "./types";

export function canvasResize(
  canvas: HTMLCanvasElement,
  resize: ResizeOption,
): void {
  const { dimension, size } = resize;

  const isWidth = dimension === "width";

  const oldWidth = canvas.width;
  const oldHeight = canvas.height;

  const ratio = (isWidth ? oldWidth : oldHeight) / size;

  const resizedWidth = isWidth ? size : oldWidth / ratio;
  const resizedHeight = !isWidth ? size : oldHeight / ratio;
  [canvas.width, canvas.height] = [resizedWidth, resizedHeight];

  ctx2d(canvas).drawImage(
    canvas,
    0,
    0,
    oldWidth,
    oldHeight,
    0,
    0,
    resizedWidth,
    resizedHeight,
  );
}
