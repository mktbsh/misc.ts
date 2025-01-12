export function ctx2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (ctx) return ctx;

  throw new Error("CanvasRenderingContext2D is not defined");
}
