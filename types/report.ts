export interface AnalysisData {
  status: number;
  responseTime: number; // in milliseconds
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  missingAltImages: number;
  wordCount: number;
}

export interface AnalyzeSuccessResponse {
  success: true;
  timestamp: string; // ISO 8601 string
  data: AnalysisData;
}

export interface AnalyzeErrorDetails {
  code: string;
  message: string;
}

export interface AnalyzeErrorResponse {
  success: false;
  error: AnalyzeErrorDetails;
}

export type AnalyzeApiResponse = AnalyzeSuccessResponse | AnalyzeErrorResponse;
