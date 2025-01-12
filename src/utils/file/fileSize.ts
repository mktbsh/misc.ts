type FileSizeSource = number | bigint | Blob;

/**
 * Units for file size representation.
 */
const UNIT = ["B", "KB", "MB", "GB", "TB", "PB"] as const;

/**
 * Converts a file size in bytes to a human-readable string representation.
 * @param source - The source of the file size, either a number of bytes, a bigint, or a Blob object.
 * @param digit - The number of decimal places to round the size to. Defaults to 2.
 * @returns A string representing the file size with appropriate unit.
 */
export function fileSize(source: FileSizeSource, digit = 2): string {
  const bytes = BigInt(
    source instanceof Blob ? source.size : Math.abs(Number(source)),
  );

  if (bytes === 0n) return `0 ${UNIT[0]}`;

  const k = 1024;
  let i = 0;
  let size = Number(bytes);

  while (size >= k && i < UNIT.length - 1) {
    size /= k;
    i++;
  }

  const unit = UNIT[i];
  const sign = isNegative(source) ? "-" : "";
  return `${sign}${size.toFixed(digit)} ${unit}`;
}

/**
 * Checks if the value is negative.
 * @param value - The value to check.
 * @returns True if the value is negative, false otherwise.
 */
function isNegative(value: FileSizeSource): boolean {
  return (
    (typeof value === "number" && value < 0) ||
    (typeof value === "bigint" && value < 0n)
  );
}
