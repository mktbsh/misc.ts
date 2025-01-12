/**
 * Asynchronously loads an image from the given source URL.
 *
 * @param source - The URL of the image to load.
 * @returns A Promise that resolves with the loaded HTMLImageElement.
 * @throws Will throw an error if the image fails to load or decode.
 */
export async function loadImageAsync(
  source: string,
): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = source;
  await image.decode();
  return image;
}
