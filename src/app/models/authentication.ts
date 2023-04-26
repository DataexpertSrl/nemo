export interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
  access_token_expires_in: number;
  grant_type: GrantType;
  expirationDate : Date | null;
}

export interface AuthenticationRequest {
  client_id: string | null;
  client_secret: string | null;
  grant_type: GrantType;
  email: string | null;
  password: string | null;
  refresh_token: string | null;
}

export type GrantType = 'password' | 'client_credentials' | 'refresh_token';

export interface SignInRequest {
  email: string;
  password: string;
  preferredLanguage: string;
}
export interface ChangePasswordRequest {
  oldPassword: string | null;
  newPassword: string | null;
  confirmNewPassword: string | null;
}
