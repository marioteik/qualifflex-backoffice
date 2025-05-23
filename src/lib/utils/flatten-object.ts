export function flattenObject<T extends object>(
  obj: T,
  parentKey = "",
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue;
    const value = obj[key];
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (value === null || typeof value !== "object") {
      // Primitive value
      result[newKey] = String(value);
    } else if (Array.isArray(value)) {
      // Array
      if (value.length > 0 && value.every((item) => typeof item !== "object")) {
        // Array of primitives
        result[newKey] = value.join(",");
      } else {
        // Array of objects or mixed
        value.forEach((item, index) => {
          const indexedKey = `${newKey}[${index}]`;
          if (item === null || typeof item !== "object") {
            // Primitive inside array
            result[indexedKey] = String(item);
          } else {
            // Object inside array
            const nested = flattenObject(item, indexedKey);
            Object.assign(result, nested);
          }
        });
      }
    } else {
      // Nested object
      const nested = flattenObject(value, newKey);
      Object.assign(result, nested);
    }
  }

  return result;
}

export function unflattenObject<T extends object>(
  flatObj: Record<string, string>,
): T {
  const result: any = {};

  for (const [flatKey, rawValue] of Object.entries(flatObj)) {
    const pathSegments = parsePath(flatKey);

    // Navigate through the result creating objects/arrays as needed
    let current = result;
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const isLast = i === pathSegments.length - 1;

      if (typeof segment.index === "number") {
        // segment indicates array access
        if (!current[segment.key]) current[segment.key] = [];
        // Ensure the array is large enough
        while (current[segment.key].length <= segment.index) {
          current[segment.key].push({});
        }

        if (isLast) {
          // Final segment leads to a value
          current[segment.key][segment.index] = parseValue(rawValue);
        } else {
          current = current[segment.key][segment.index];
        }
      } else {
        // Regular object key
        if (isLast) {
          // Final segment, set value
          current[segment.key] = parseValue(rawValue);
        } else {
          // Ensure nested object exists
          if (
            !current[segment.key] ||
            typeof current[segment.key] !== "object"
          ) {
            current[segment.key] = {};
          }
          current = current[segment.key];
        }
      }
    }
  }

  return result;
}

function parsePath(key: string): { key: string; index?: number }[] {
  // Split by '.'
  const parts = key.split(".");
  const segments: { key: string; index?: number }[] = [];

  for (const part of parts) {
    const match = part.match(/^(.*?)\[(\d+)\]$/);
    if (match) {
      // part like "arrayName[0]"
      segments.push({ key: match[1], index: Number(match[2]) });
    } else {
      // simple key
      segments.push({ key: part });
    }
  }

  return segments;
}

function parseValue(val: string): any {
  // Handle special primitives
  if (val === "null") return null;
  if (val === "true") return true;
  if (val === "false") return false;

  // Try number
  const num = Number(val);
  if (!isNaN(num) && val.trim() !== "") return num;

  // Check for comma-separated values (array of primitives)
  if (val.includes(",")) {
    return val.split(",").map((item) => parseValue(item));
  }

  // Check if it's a serialized empty object "{}"
  if (val.trim() === "{}") return {};

  // Otherwise, treat as string
  return val;
}
