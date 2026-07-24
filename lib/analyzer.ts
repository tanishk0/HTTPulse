import axios from "axios";
import * as cheerio from "cheerio";
import { AnalyzeSuccessResponse, AnalyzeErrorResponse } from "@/types/report";
import { ERROR_CODES, AppError } from "./errors";

export type AnalysisResult =
  | AnalyzeSuccessResponse
  | (AnalyzeErrorResponse & { httpStatus: number });

export async function analyzeWebpage(targetUrl: string): Promise<AnalysisResult> {
  const startTime = performance.now();

  try {
    const response = await axios.get(targetUrl, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 HTTPulse/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 600,
    });

    const responseTime = Math.round(performance.now() - startTime);
    const statusCode = response.status;

    // Handle target HTTP 404, 500, or other error status codes (request succeeded, but page has error)
    if (statusCode === 404) {
      return buildErrorResult(ERROR_CODES.HTTP_404);
    }

    if (statusCode >= 500) {
      return buildErrorResult(ERROR_CODES.HTTP_500);
    }

    if (statusCode >= 400) {
      return {
        success: false,
        error: {
          code: `HTTP_${statusCode}`,
          message: `The target server returned HTTP status ${statusCode}.`,
        },
        httpStatus: 502,
      };
    }

    // Content-Type validation
    const contentType = (response.headers["content-type"] || "").toString().toLowerCase();
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      return buildErrorResult(ERROR_CODES.NON_HTML_CONTENT);
    }

    const html = typeof response.data === "string" ? response.data : String(response.data);

    // Parse HTML using Cheerio with fallback safety
    const $ = cheerio.load(html);

    // Extract Title (fallback if missing)
    const title = $("title").first().text().trim() || "No title found";

    // Extract Meta Description (fallback if missing)
    let metaDescription =
      $('meta[name="description" i]').attr("content") ||
      $('meta[property="og:description" i]').attr("content") ||
      "No meta description found.";
    metaDescription = metaDescription.trim();

    // Extract H1 count
    const h1Count = $("h1").length;

    // Extract Missing Alt Images count
    let missingAltImages = 0;
    $("img").each((_, el) => {
      const alt = $(el).attr("alt");
      if (alt === undefined || alt === null || alt.trim() === "") {
        missingAltImages++;
      }
    });

    // Extract Word Count safely
    const targetEl = $("body").length ? $("body") : $("html");
    const bodyCopy = targetEl.clone();
    bodyCopy.find("script, style, noscript, svg, template").remove();

    const rawText = bodyCopy.text();
    const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).filter(Boolean).length : 0;

    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        status: statusCode,
        responseTime,
        title,
        metaDescription,
        h1Count,
        missingAltImages,
        wordCount,
      },
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const code = err.code || "";
      const message = err.message || "";

      if (code === "ECONNABORTED" || message.includes("timeout")) {
        return buildErrorResult(ERROR_CODES.REQUEST_TIMEOUT);
      }

      if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
        return buildErrorResult(ERROR_CODES.DNS_FAILURE);
      }

      if (code === "ECONNREFUSED") {
        return buildErrorResult(ERROR_CODES.CONNECTION_REFUSED);
      }

      if (code === "ERR_FR_TOO_MANY_REDIRECTS") {
        return buildErrorResult(ERROR_CODES.TOO_MANY_REDIRECTS);
      }

      // Check SSL/TLS certification errors
      if (
        code.includes("CERT") ||
        code.includes("SSL") ||
        code.includes("TLS") ||
        message.includes("certificate") ||
        message.includes("SSL")
      ) {
        return buildErrorResult(ERROR_CODES.SSL_ERROR);
      }

      return buildErrorResult(ERROR_CODES.NETWORK_FAILURE);
    }

    return buildErrorResult(ERROR_CODES.SERVER_ERROR);
  }
}

function buildErrorResult(appError: AppError): AnalyzeErrorResponse & { httpStatus: number } {
  return {
    success: false,
    error: {
      code: appError.code,
      message: appError.message,
    },
    httpStatus: appError.httpStatus,
  };
}
