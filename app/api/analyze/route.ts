import { NextResponse } from "next/server";
import { validateUrl } from "@/lib/validator";
import { analyzeWebpage } from "@/lib/analyzer";
import { ERROR_CODES } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawUrl = body?.url;

    // Validate URL input
    const validation = validateUrl(rawUrl);
    if (!validation.isValid || !validation.normalizedUrl || validation.error) {
      const err = validation.error || ERROR_CODES.INVALID_URL;
      return NextResponse.json(
        {
          success: false,
          error: {
            code: err.code,
            message: err.message,
          },
        },
        { status: err.httpStatus }
      );
    }

    // Perform analysis
    const result = await analyzeWebpage(validation.normalizedUrl);

    if (!result.success) {
      const { httpStatus, ...errorPayload } = result;
      return NextResponse.json(errorPayload, { status: httpStatus || 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch {
    // Prevent internal errors/stack traces from leaking to client
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.SERVER_ERROR.code,
          message: ERROR_CODES.SERVER_ERROR.message,
        },
      },
      { status: 500 }
    );
  }
}
