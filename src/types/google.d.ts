// Minimal type declarations for Google Identity Services (GIS)
declare namespace google.accounts.oauth2 {
  interface TokenResponse {
    access_token: string
    error?: string
  }

  interface TokenClientConfig {
    client_id: string
    scope: string
    callback: (response: TokenResponse) => void
  }

  interface TokenClient {
    callback: (response: TokenResponse) => void
    requestAccessToken(options?: { prompt?: string }): void
  }

  function initTokenClient(config: TokenClientConfig): TokenClient
}
