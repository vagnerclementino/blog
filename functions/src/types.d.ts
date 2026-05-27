declare module "disposable-email-domains" {
  const domains: string[];
  export default domains;
}

export interface SubscribeRequest {
  email: string;
  name: string;
}

export interface SubscribeSuccessResponse {
  message: string;
}

export interface SubscribeErrorResponse {
  error: string;
}

export type SubscribeResponse = SubscribeSuccessResponse | SubscribeErrorResponse;

export interface MailchimpMergeFields {
  FNAME: string;
  LNAME: string;
}

export interface MailchimpAddMemberBody {
  email_address: string;
  status: "pending" | "subscribed";
  merge_fields: MailchimpMergeFields;
}

export interface MailchimpErrorResponse {
  title?: string;
  detail?: string;
  status?: number;
}
