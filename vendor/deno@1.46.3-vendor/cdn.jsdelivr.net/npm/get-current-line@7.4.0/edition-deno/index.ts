/** The combination of location information about the line that was executing at the time */
export interface Location {
  /** the location of the line that was executing at the time */
  line: number;
  /** the location of the character that was executing at the time */
  char: number;
  /** the method name that was executing at the time */
  method: string;
  /** the file path that was executing at the time */
  file: string;
}
/**
 * If provided, continue skipping until:
 *
 * 1. The file or method is found
 * 2. Once found, will continue until neither the file nor method are found anymore
 * 3. Once exited, the frame offset will then apply
 *
 * If you wish to capture the found method or the file, combine them with `frames: -1` or `immediate: true`.
 *
 * If you wish for more customisation than this, create an issue requesting passing a custom skip handler function, as more variance to this interface is too much customisation complexity.
 */
export interface Offset {
  /**
   * if provided, continue until a method containing or matching this string is exited
   * if provided alongside a file, will continue until neither the file nor method are found
   * this allows file and method to act as fallbacks for each other, such that if one is not found, it doesn't skip everything
   */
  method?: RegExp | string | null;
  /**
   * if provided, continue until a file containing or matching this string is exited
   * if provided alongside a method, will continue until neither the file nor method are found
   * this allows file and method to act as fallbacks for each other, such that if one is not found, it doesn't skip everything
   */
  file?: RegExp | string | null;
  /**
   * once we have satisfied the found condition, if any, then apply this index offset to the frames
   * e.g. 1 would mean next frame, and -1 would mean the previous frame
   * Use -1 to go back to the found method or file
   */
  frames?: number;
  /**
   * once we have satisfied the found condition, should we apply the frame offset immediately, or wait until the found condition has exited
   */
  immediate?: boolean;
}
/**
 * For an error instance, return its stack frames as an array.
 */
export function getFramesFromError(error: Error): Array<string> {
  // Create an error
  let stack: Error["stack"] | null, frames: any[];
  // And attempt to retrieve it's stack
  // https://github.com/winstonjs/winston/issues/401#issuecomment-61913086
  try {
    stack = error.stack;
  } catch (error1) {
    try {
      // @ts-ignore
      const previous = err.__previous__ || err.__previous;
      stack = previous && previous.stack;
    } catch (error2) {
      stack = null;
    }
  }
  // Handle different stack formats
  if (stack) {
    if (Array.isArray(stack)) {
      frames = Array(stack);
    } else {
      frames = stack.toString().split("\n");
    }
  } else {
    frames = [];
  }
  // Parse our frames
  return frames;
}
// Compatibility with Node.js versions <10
let frameRegexNamedGroups: RegExp, frameRegexNumberedGroups: RegExp;
try {
  frameRegexNamedGroups =
    /\s+at\s(?:(?<method>.+?)\s\()?(?<file>.+?):(?<line>\d+):(?<char>\d+)\)?\s*$/;
} catch (error) {
  frameRegexNumberedGroups = /\s+at\s(?:(.+?)\s\()?(.+?):(\d+):(\d+)\)?\s*$/;
}
/**
 * Get the locations from a list of error stack frames.
 */
export function getLocationsFromFrames(frames: Array<string>): Array<Location> {
  // Prepare
  const locations: Array<Location> = [];
  // Cycle through the frames
  for (let frame of frames) {
    // ensure each frame is a string
    frame = (frame || "").toString();
    // skip empty frames
    if (frame.length === 0) {
      continue;
    }
    // Error
    // at file:///Users/balupton/Projects/active/get-current-line/asd.js:1:13
    // at ModuleJob.run (internal/modules/esm/module_job.js:140:23)
    // at async Loader.import (internal/modules/esm/loader.js:165:24)
    // at async Object.loadESM (internal/process/esm_loader.js:68:5)
    if (frameRegexNamedGroups) {
      const match = frame.match(frameRegexNamedGroups);
      if (match && match.groups) {
        locations.push({
          method: match.groups.method || "",
          file: match.groups.file || "",
          line: Number(match.groups.line),
          char: Number(match.groups.char),
        });
      }
    } else {
      const [match, method, file, line, char] =
        frame.match(frameRegexNumberedGroups) || [];
      if (match) {
        locations.push({
          method: method || "",
          file: file || "",
          line: Number(line),
          char: Number(char),
        });
      }
    }
  }
  return locations;
}
/**
 * If a location is not found, this is the result that is used.
 */
const failureLocation: Location = {
  line: -1,
  char: -1,
  method: "",
  file: "",
};
/**
 * From a list of locations, get the location that is determined by the offset.
 * If none are found, return the failure location
 */
export function getLocationWithOffset(
  locations: Array<Location>,
  offset: Offset,
): Location {
  // Continue
  let found: boolean = !offset.file && !offset.method;
  // use while loop so we can skip ahead
  let i = 0;
  while (i < locations.length) {
    const location = locations[i];
    // the current location matches the offset
    if (
      (offset.file &&
        (typeof offset.file === "string"
          ? location.file.includes(offset.file)
          : offset.file.test(location.file))) ||
      (offset.method &&
        (typeof offset.method === "string"
          ? location.method.includes(offset.method)
          : offset.method.test(location.method)))
    ) {
      // we are found, and we should exit immediatelyg, so return with the frame offset applied
      if (offset.immediate) {
        // apply frame offset
        i += offset.frames || 0;
        // and return the result
        return locations[i];
      } // otherwise, continue until the found condition has exited
      else {
        found = true;
        ++i;
        continue;
      }
    } // has been found, and the found condition has exited, so return with the frame offset applied
    else if (found) {
      // apply frame offset
      i += offset.frames || 0;
      // and return the result
      return locations[i];
    } // nothing has been found yet, so continue until we find the offset
    else {
      ++i;
      continue;
    }
  }
  // return failure
  return failureLocation;
}
/**
 * Get each error stack frame's location information.
 */
function getLocationsFromError(error: Error): Array<Location> {
  const frames = getFramesFromError(error);
  return getLocationsFromFrames(frames);
}
/**
 * Get the file path that appears in the stack of the passed error.
 * If no offset is provided, then the first location that has a file path will be used.
 */
export function getFileFromError(error: Error, offset: Offset = {
  file: /./,
  immediate: true,
}): string {
  const locations = getLocationsFromError(error);
  return getLocationWithOffset(locations, offset).file;
}
/**
 * Get first determined location information that appears in the stack of the error.
 * If no offset is provided, then the offset used will determine the first location information.
 */
export function getLocationFromError(error: Error, offset: Offset = {
  immediate: true,
}): Location {
  const locations = getLocationsFromError(error);
  return getLocationWithOffset(locations, offset);
}
/**
 * Get the location information about the line that called this method.
 * If no offset is provided, then continue until the caller of the `getCurrentLine` is found.
 * @example Input
 * ``` javascript
 * console.log(getCurrentLine())
 * ```
 * @example Result
 * ``` json
 * {
 * 	"line": "1",
 * 	"char": "12",
 * 	"method": "Object.<anonymous>",
 * 	"file": "/Users/balupton/some-project/calling-file.js"
 * }
 * ```
 */
export default function getCurrentLine(offset: Offset = {
  method: "getCurrentLine",
  frames: 0,
  immediate: false,
}): Location {
  return getLocationFromError(new Error(), offset);
}
