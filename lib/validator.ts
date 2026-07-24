import { ERROR_CODES, AppError } from "./errors";

export interface ValidationResult {
  isValid: boolean;
  normalizedUrl?: string;
  error?: AppError;
}

export function validateUrl(rawUrl?: string): ValidationResult {
  if (!rawUrl || typeof rawUrl !== "string" || rawUrl.trim() === "") {
    return {
      isValid: false,
      error: ERROR_CODES.EMPTY_URL,
    };
  }

  let trimmed = rawUrl.trim();

  // Check for explicit unsupported protocols (e.g. ftp://, file://, javascript:, mailto:, data:)
  const protocolMatch = trimmed.match(/^([a-z0-9+\-.]+):/i);
  if (protocolMatch) {
    const scheme = protocolMatch[1].toLowerCase();
    if (scheme !== "http" && scheme !== "https") {
      return {
        isValid: false,
        error: ERROR_CODES.UNSUPPORTED_PROTOCOL,
      };
    }
  } else {
    // Prepend https:// if protocol is omitted
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        isValid: false,
        error: ERROR_CODES.UNSUPPORTED_PROTOCOL,
      };
    }

    const hostname = parsed.hostname;
    if (!hostname || (hostname !== "localhost" && !hostname.includes("."))) {
      return {
        isValid: false,
        error: ERROR_CODES.INVALID_URL,
      };
    }

    return {
      isValid: true,
      normalizedUrl: parsed.toString(),
    };
  } catch {
    return {
      isValid: false,
      error: ERROR_CODES.INVALID_URL,
    };
  }
}
