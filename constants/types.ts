export interface ErrorObject {
  code: string;
  longMessage: string;
  message: string;
  meta: Meta;
}

export interface Meta {
  paramName?: string;
  sessionId?: string;
  emailAddresses?: string[];
  identifiers?: string[];
  zxcvbn?: {
    suggestions: {
      code: string;
      message: string;
    }[];
  };
  permissions?: string[];
}
