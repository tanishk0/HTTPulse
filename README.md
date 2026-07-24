# HTTPulse

HTTPulse is a developer-first website inspection and auditing tool that analyzes any publicly accessible webpage and presents both a structured JSON API response and a visual report. It is designed to make webpage inspection simple while demonstrating clean API design, robust error handling, and modular software architecture.

The application accepts a URL, fetches the target webpage, parses its HTML using Cheerio, and extracts useful metrics such as HTTP status, response time, page title, meta description, H1 count, missing image alt attributes, and approximate visible word count. The backend exposes a consistent JSON API, while the frontend visualizes the same data through an intuitive interface.

The project emphasizes correctness, structured API responses, and graceful error handling for scenarios including invalid URLs, network failures, HTTP errors, timeouts, and unsupported content types.

Built using Next.js, TypeScript, Tailwind CSS, and Cheerio, HTTPulse serves as both a practical developer utility and a demonstration of production-oriented engineering practices. Future versions will expand the inspection engine with richer SEO analysis, accessibility auditing, page health scoring, and actionable optimization suggestions while preserving a lightweight, developer-friendly experience.