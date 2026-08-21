/**
 * TypeScript types for all HappiLIFE Awareness Tool API shapes.
 *
 * These are inferred from the API specification. Adjust field names if the
 * real responses differ — only this file needs to change, not the components.
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export interface Option {
  /** The ID sent to save-option / update-last-answer */
  id: number;
  /** Display text for this choice — API field name is 'option' */
  option: string;
  score?: number;
  option_id?: number;
}

export interface Question {
  id: number;
  /** The question text — API field name is 'question' */
  question: string;
  category?: string;
  options: Option[];
  /** ID of the already-selected option (if this page was resumed) */
  selected_option_id?: number | null;
}

/** Pagination metadata returned with each page of questions */
export interface AssessmentOverview {
  /** Total questions in the assessment */
  total: number;
  /** How many the user has already answered */
  answered: number;
  /** Questions served per page */
  perPage: number;
  /** 1-indexed current page number */
  current_page: number;
  /** last_page is NOT returned by API — calculate as Math.ceil(total / perPage) */
  last_page?: number;
}

// ---------------------------------------------------------------------------
// Endpoint request / response shapes
// ---------------------------------------------------------------------------

/** GET|POST /api/v1/checkifany */
export interface CheckIfAnyResponse {
  /** "Yes" if at least one assessment has been completed, "No" otherwise */
  data: "Yes" | "No";
  message?: string;
  status?: number;
}

/** GET|POST /api/v1/start-assessment
 * NOTE: questions and overview are at the TOP LEVEL of the response,
 * NOT nested under a 'data' key. */
export interface StartAssessmentResponse {
  /** Present when user has hit the 6-attempt cap */
  max_attempts_reached?: boolean;
  /** Present when user completed within the last minute — server blocks new attempts temporarily */
  recently_completed?: boolean;
  message?: string;
  status?: string | number;
  /** Questions for the current page */
  questions?: Question[];
  overview?: AssessmentOverview;
}

/** GET|POST /api/v1/save-option — request body */
export interface SaveOptionRequest {
  option_question_id: number;
}

/** GET|POST /api/v1/save-option — response */
export interface SaveOptionResponse {
  /** `true` for normal saves, `"completed"` (string) when this was the last question */
  message?: string | boolean;
  status?: number;
}

/** GET|POST /api/v1/complete-assessment */
export interface CompleteAssessmentResponse {
  message?: string;
  status?: number;
}

/** GET|POST /api/v1/view-report */
export interface ViewReportResponse {
  /** In-app web URL for the HTML report */
  url?: string;
  data?: { url: string };
  message?: string;
  status?: number;
}

/** GET|POST /api/v1/get-report */
export interface GetReportResponse {
  /** Signed S3 URL for the PDF download; may take a few seconds to generate */
  url?: string;
  data?: { url: string };
  message?: string;
  /** 400 = not completed yet */
  status?: number;
}

/** A single past assessment record */
export interface ReportItem {
  id: number;
  /** ISO 8601 timestamp when the assessment was submitted */
  ended_at: string | null;
  /** ISO 8601 timestamp when the assessment was started */
  created_at: string;
  /** Report URL if available */
  report_url?: string | null;
  // The exact field name for the report link isn't confirmed against the
  // live API yet — these are tolerated as fallbacks (see ReportScreen).
  url?: string | null;
  pdf_url?: string | null;
  download_url?: string | null;
  report?: string | null;
}

/** GET|POST /api/v1/get-all-report */
export interface GetAllReportsResponse {
  data?: ReportItem[];
  message?: string;
  status?: number;
}

/**
 * GET|POST /api/v1/assessment-status
 * 200 = completed, 400 = not yet completed.
 * Note: similar to checkifany but with HTTP status codes instead of a "Yes"/"No" body.
 */
export interface AssessmentStatusResponse {
  message?: string;
  completed?: boolean;
  status?: number;
}

/** GET|POST /api/v1/update-last-answer — request body */
export interface UpdateLastAnswerRequest {
  option_question_id: number;
}

/** GET|POST /api/v1/update-last-answer — response */
export interface UpdateLastAnswerResponse {
  message?: string;
  status?: number;
}

// ---------------------------------------------------------------------------
// Internal error type
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isNotCompleted() {
    return this.statusCode === 400;
  }
}
