export type SupportedImageType = "png" | "jpeg" | "webp";

export interface ResizeOption {
  dimension: "width" | "height";
  size: number;
}

export interface ImageOptions {
  type?: SupportedImageType;
  quality?: number;
  resize?: ResizeOption;
}
