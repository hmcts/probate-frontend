export interface Event {
  id: string;
  summary?: string;
  description?: string;
}

export interface CaseDetails {
  id: number;
  jurisdiction: string;
  case_type_id?: string;
  created_Date?: string;
  last_modified?: string;
  state?: string;
  locked_by_user_id?: number;
  security_level?: number;
  case_data?: Record<string, unknown>;
  security_classification?: string;
  callback_response_status?: string;
  version?: number;
}

export interface StartEventResponse {
  case_details: CaseDetails;
  event_id: string;
  token: string;
}

export interface DataContent {
  event: Event;
  data?: Record<string, unknown>;
  supplementary_data_request?: Record<string, Record<string, unknown>>;
  security_classification?: string;
  event_token: string;
  ignore_warning: boolean;
  case_reference?: string;
}

export interface CaseEventResult {
  caseId: number;
  jurisdiction: string;
  state: string;
  caseData: Record<string, unknown>;
  startEventResponse: StartEventResponse;
}

export interface SubmitEventResponse {
  id: number;                          // case ID
  jurisdiction: string;                // jurisdiction
  case_type_id?: string;               // case type
  state: string;                       // current state after event

  created_date?: string;               // when case was created
  last_modified?: string;              // when case was last updated
  last_state_modified_date?: string;   // when state last changed

  data?: Record<string, unknown>;      // actual case data fields

  security_classification?: string;    // PUBLIC/PRIVATE/RESTRICTED
  data_classification?: Record<string, unknown>; // field-level classifications
  callback_response_status?: string;   // callback result
  version?: number;                    // optimistic locking version
}
