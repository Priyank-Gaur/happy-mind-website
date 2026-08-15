/**
 * All 9 HappiLIFE Awareness Tool endpoint wrappers.
 *
 * Components import from here — never call apiPost() directly from UI code.
 * If the base URL ever moves to a BFF proxy, only VITE_HAPPILIFE_API_URL needs
 * updating; none of these functions change.
 */

import { apiPost } from "./client";
import type {
  CheckIfAnyResponse,
  StartAssessmentResponse,
  SaveOptionRequest,
  SaveOptionResponse,
  CompleteAssessmentResponse,
  ViewReportResponse,
  GetReportResponse,
  GetAllReportsResponse,
  AssessmentStatusResponse,
  UpdateLastAnswerRequest,
  UpdateLastAnswerResponse,
} from "./types";

// ---------------------------------------------------------------------------
// 1. checkifany — has the user completed at least one assessment?
// ---------------------------------------------------------------------------
export function checkIfAny(): Promise<CheckIfAnyResponse> {
  return apiPost<CheckIfAnyResponse>("/api/v1/checkifany");
}

// ---------------------------------------------------------------------------
// 2. start-assessment — start or resume; returns paginated questions
//    platform: "mobile" is required per the API spec
// ---------------------------------------------------------------------------
export function startAssessment(): Promise<StartAssessmentResponse> {
  return apiPost<StartAssessmentResponse>("/api/v1/start-assessment", {
    platform: "mobile",
  });
}

// ---------------------------------------------------------------------------
// 3. save-option — save one answer (called immediately when user selects)
// ---------------------------------------------------------------------------
export function saveOption(
  optionQuestionId: number,
): Promise<SaveOptionResponse> {
  const body: SaveOptionRequest = { option_question_id: optionQuestionId };
  return apiPost<SaveOptionResponse>("/api/v1/save-option", body);
}

// ---------------------------------------------------------------------------
// 4. complete-assessment — call once all questions are answered
// ---------------------------------------------------------------------------
export function completeAssessment(): Promise<CompleteAssessmentResponse> {
  return apiPost<CompleteAssessmentResponse>("/api/v1/complete-assessment");
}

// ---------------------------------------------------------------------------
// 5. view-report — returns a web URL to display the HTML report in-app
// ---------------------------------------------------------------------------
export function viewReport(): Promise<ViewReportResponse> {
  return apiPost<ViewReportResponse>("/api/v1/view-report");
}

// ---------------------------------------------------------------------------
// 6. get-report — returns a signed S3 PDF URL; 400 = not completed yet
// ---------------------------------------------------------------------------
export function getReport(): Promise<GetReportResponse> {
  return apiPost<GetReportResponse>("/api/v1/get-report");
}

// ---------------------------------------------------------------------------
// 7. get-all-report — list of all past completed reports
// ---------------------------------------------------------------------------
export function getAllReports(): Promise<GetAllReportsResponse> {
  return apiPost<GetAllReportsResponse>("/api/v1/get-all-report");
}

// ---------------------------------------------------------------------------
// 8. assessment-status — 200 = complete, 400 = not complete
// ---------------------------------------------------------------------------
export function assessmentStatus(): Promise<AssessmentStatusResponse> {
  return apiPost<AssessmentStatusResponse>("/api/v1/assessment-status");
}

// ---------------------------------------------------------------------------
// 9. update-last-answer — change only the most recently saved answer
// ---------------------------------------------------------------------------
export function updateLastAnswer(
  optionQuestionId: number,
): Promise<UpdateLastAnswerResponse> {
  const body: UpdateLastAnswerRequest = {
    option_question_id: optionQuestionId,
  };
  return apiPost<UpdateLastAnswerResponse>(
    "/api/v1/update-last-answer",
    body,
  );
}
