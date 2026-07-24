import * as cheerio from "cheerio";

export interface ParsedMetrics {
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  missingAltImages: number;
  wordCount: number;
}

export function parseHtmlMetrics(html: string): ParsedMetrics {
  if (!html || typeof html !== "string") {
    return {
      title: null,
      metaDescription: null,
      h1Count: 0,
      missingAltImages: 0,
      wordCount: 0,
    };
  }

  const $ = cheerio.load(html);

  // Extract Title (return null if missing or empty)
  const rawTitle = $("title").first().text().trim();
  const title = rawTitle.length > 0 ? rawTitle : null;

  // Extract Meta Description (return null if missing or empty)
  const rawMetaDescription =
    $('meta[name="description" i]').attr("content") ||
    $('meta[property="og:description" i]').attr("content") ||
    "";
  const metaDescription =
    rawMetaDescription.trim().length > 0 ? rawMetaDescription.trim() : null;

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

  // Remove non-visible elements
  bodyCopy.find("script, style, noscript, svg, template").remove();

  // Ensure block-level elements have trailing space to prevent words from merging across tags
  bodyCopy
    .find("p, div, h1, h2, h3, h4, h5, h6, li, section, header, footer, article, td, th")
    .append(" ");

  const rawText = bodyCopy.text();
  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).filter(Boolean).length : 0;

  return {
    title,
    metaDescription,
    h1Count,
    missingAltImages,
    wordCount,
  };
}
