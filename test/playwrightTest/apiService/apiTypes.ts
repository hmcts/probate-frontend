export interface Event {
  eventId: string;
  summary?: string;
  description?: string;
}

export interface CaseDetails {
  id: number;
  jurisdiction: string;
  caseTypeId?: string;
  createdDate?: string;
  lastModified?: string;
  state?: string;
  lockedBy?: number;
  security_level?: number;
  data?: Record<string, any>;
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
  data?: Record<string, any>;
  supplementary_data_request?: Record<string, Record<string, any>>;
  security_classification?: string;
  event_token: string;
  ignore_warning: boolean;
  caseReference?: string;
}

