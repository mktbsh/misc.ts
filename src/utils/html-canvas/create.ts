import { ctx2d } from "./context";

/**
 * Creates a canvas element and optionally draws an image or video frame onto it.
 *
 * @param ref - Optional reference to an HTMLImageElement or HTMLVideoElement.
 *              If provided, its content will be drawn onto the canvas.
 * @returns A new HTMLCanvasElement.
 * @throws Will throw an error if the 2D context cannot be obtained from the canvas.
 */
export function createCanvasElement(
  ref?: HTMLImageElement | HTMLVideoElement,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  if (!ref) return canvas;

  const isImg = ref instanceof HTMLImageElement;
  [canvas.width, canvas.height] = isImg
    ? [ref.naturalWidth, ref.naturalHeight]
    : [ref.videoWidth, ref.videoHeight];

  ctx2d(canvas).drawImage(ref, 0, 0, canvas.width, canvas.height);

  return canvas;
}
