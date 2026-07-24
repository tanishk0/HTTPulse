import { describe, it, expect } from "vitest";
import { parseHtmlMetrics } from "../lib/parser";

describe("parseHtmlMetrics - Standalone HTML Parser Module", () => {
  // ---------------------------------------------------------------------------
  // 1. Overall Happy Path & Baseline Integration
  // ---------------------------------------------------------------------------
  describe("Happy Path Integration", () => {
    it("extracts all page metrics correctly from a complete HTML document", () => {
      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>  Production Ready Dev Tool  </title>
            <meta name="description" content="A comprehensive analysis engine for inspectable web pages." />
          </head>
          <body>
            <h1>HTTPulse Analyzer</h1>
            <p>Inspect webpage title, meta description, and alt image counts easily.</p>
            <img src="logo.png" alt="HTTPulse Logo" />
            <img src="avatar.jpg" />
          </body>
        </html>
      `;

      const result = parseHtmlMetrics(html);

      expect(result.title).toBe("Production Ready Dev Tool");
      expect(result.metaDescription).toBe(
        "A comprehensive analysis engine for inspectable web pages."
      );
      expect(result.h1Count).toBe(1);
      expect(result.missingAltImages).toBe(1);
      expect(result.wordCount).toBeGreaterThan(0);
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Title Extraction
  // ---------------------------------------------------------------------------
  describe("Title Extraction", () => {
    it("extracts and trims title text correctly", () => {
      const html = "<title>   Sample Page Title   </title>";
      const result = parseHtmlMetrics(html);
      expect(result.title).toBe("Sample Page Title");
    });

    it("returns null when no title tag exists in the document", () => {
      const html = "<html><head></head><body><h1>No Title</h1></body></html>";
      const result = parseHtmlMetrics(html);
      expect(result.title).toBeNull();
    });

    it("returns null when title tag contains only whitespace", () => {
      const html = "<title>     </title>";
      const result = parseHtmlMetrics(html);
      expect(result.title).toBeNull();
    });

    it("extracts only the first title tag if multiple title tags exist", () => {
      const html = "<title>First Title</title><title>Second Title</title>";
      const result = parseHtmlMetrics(html);
      expect(result.title).toBe("First Title");
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Meta Description Extraction
  // ---------------------------------------------------------------------------
  describe("Meta Description Extraction", () => {
    it("extracts meta description from standard meta name='description' tag", () => {
      const html = '<meta name="description" content="Standard description content." />';
      const result = parseHtmlMetrics(html);
      expect(result.metaDescription).toBe("Standard description content.");
    });

    it("extracts meta description from OpenGraph meta property='og:description' as fallback", () => {
      const html = '<meta property="og:description" content="OpenGraph fallback description." />';
      const result = parseHtmlMetrics(html);
      expect(result.metaDescription).toBe("OpenGraph fallback description.");
    });

    it("returns null when meta description tag is absent", () => {
      const html = "<html><head><title>No Description Page</title></head></html>";
      const result = parseHtmlMetrics(html);
      expect(result.metaDescription).toBeNull();
    });

    it("returns null when meta description content attribute is empty or whitespace-only", () => {
      const html = '<meta name="description" content="   " />';
      const result = parseHtmlMetrics(html);
      expect(result.metaDescription).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // 4. H1 Element Counting
  // ---------------------------------------------------------------------------
  describe("H1 Element Counting", () => {
    it("returns 0 when no H1 elements exist in the document", () => {
      const html = "<div><h2>Subtitle</h2><p>Body paragraph</p></div>";
      const result = parseHtmlMetrics(html);
      expect(result.h1Count).toBe(0);
    });

    it("correctly counts a single H1 element", () => {
      const html = "<h1>Main Heading</h1>";
      const result = parseHtmlMetrics(html);
      expect(result.h1Count).toBe(1);
    });

    it("correctly counts multiple H1 elements across different containers", () => {
      const html = `
        <header><h1>Primary Hero Title</h1></header>
        <main>
          <h1>Secondary Section Title</h1>
          <article><h1>Article Heading</h1></article>
        </main>
      `;
      const result = parseHtmlMetrics(html);
      expect(result.h1Count).toBe(3);
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Image Accessibility & Missing Alt Attributes
  // ---------------------------------------------------------------------------
  describe("Image Accessibility", () => {
    it("returns 0 when all images contain non-empty alt attributes", () => {
      const html = `
        <img src="a.png" alt="Image A description" />
        <img src="b.png" alt="Image B description" />
      `;
      const result = parseHtmlMetrics(html);
      expect(result.missingAltImages).toBe(0);
    });

    it("counts images missing the alt attribute entirely", () => {
      const html = `
        <img src="valid.png" alt="Valid alt text" />
        <img src="missing1.png" />
        <img src="missing2.png" />
      `;
      const result = parseHtmlMetrics(html);
      expect(result.missingAltImages).toBe(2);
    });

    it("counts images with empty or whitespace-only alt attributes as missing alt text", () => {
      const html = `
        <img src="empty.png" alt="" />
        <img src="spaces.png" alt="   " />
      `;
      const result = parseHtmlMetrics(html);
      expect(result.missingAltImages).toBe(2);
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Word Count Calculation
  // ---------------------------------------------------------------------------
  describe("Word Count Calculation", () => {
    it("counts visible text words accurately", () => {
      const html = "<body><p>One two three four five.</p></body>";
      const result = parseHtmlMetrics(html);
      expect(result.wordCount).toBe(5);
    });

    it("ignores non-visible elements like script, style, noscript, svg, and template tags", () => {
      const html = `
        <body>
          <p>Visible content text.</p>
          <script>const secret = "should not be counted into word count";</script>
          <style>body { background: black; font-size: 14px; }</style>
          <noscript>JavaScript disabled notice text</noscript>
          <svg><text>SVG Text</text></svg>
        </body>
      `;
      const result = parseHtmlMetrics(html);
      expect(result.wordCount).toBe(3); // "Visible content text."
    });

    it("normalizes and handles excessive whitespace, tabs, and newlines correctly", () => {
      const html = `
        <body>
          <p>
            Word    one     word two
            word\tthree\nword four
          </p>
        </body>
      `;
      const result = parseHtmlMetrics(html);
      expect(result.wordCount).toBe(8);
    });

    it("returns 0 for empty or whitespace-only HTML documents", () => {
      const html = "<body>   \n\t   </body>";
      const result = parseHtmlMetrics(html);
      expect(result.wordCount).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Robustness & HTML Variations
  // ---------------------------------------------------------------------------
  describe("Robustness & Variations", () => {
    it("parses HTML fragments without html, head, or body wrapper tags", () => {
      const fragment = "<h1>Fragment Heading</h1><p>Fragment text content.</p>";
      const result = parseHtmlMetrics(fragment);

      expect(result.h1Count).toBe(1);
      expect(result.wordCount).toBe(5);
      expect(result.title).toBeNull();
    });

    it("handles malformed or unclosed HTML tags gracefully without throwing exceptions", () => {
      const malformedHtml = "<div><h1>Unclosed Header<p>Paragraph inside unclosed div";
      expect(() => parseHtmlMetrics(malformedHtml)).not.toThrow();

      const result = parseHtmlMetrics(malformedHtml);
      expect(result.h1Count).toBe(1);
      expect(result.wordCount).toBe(5);
    });

    it("handles empty or invalid non-string inputs safely returning nulls and zeros", () => {
      expect(() => parseHtmlMetrics("")).not.toThrow();
      const emptyResult = parseHtmlMetrics("");
      expect(emptyResult.title).toBeNull();
      expect(emptyResult.metaDescription).toBeNull();
      expect(emptyResult.h1Count).toBe(0);
      expect(emptyResult.missingAltImages).toBe(0);
      expect(emptyResult.wordCount).toBe(0);
    });
  });
});
