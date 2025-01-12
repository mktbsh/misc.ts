/**
 * Options for the headless file picker.
 */
type HeadlessFilePickerOptions = {
  /** The accepted file types. Defaults to "*". */
  accept?: HTMLInputElement["accept"];
  /** Whether multiple file selection is allowed. Defaults to false. */
  multiple?: HTMLInputElement["multiple"];
};

/**
 * Opens a headless file picker and returns a Promise that resolves with the selected files.
 * @param options - The options for the file picker.
 * @returns A Promise that resolves with the selected FileList.
 * @throws An error if no files are selected.
 */
export async function headlessFilePicker({
  accept = "*",
  multiple = false,
}: HeadlessFilePickerOptions = {}): Promise<FileList> {
  return new Promise<FileList>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple;
    input.accept = accept;

    input.onchange = () => {
      if (input.files) {
        resolve(input.files);
      } else {
        reject(new Error("No files selected"));
      }
      input.remove();
    };
    input.click();
  });
}
