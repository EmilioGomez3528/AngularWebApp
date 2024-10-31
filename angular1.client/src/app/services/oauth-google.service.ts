import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

const config: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: 'https://localhost:4200/authLoader',
  clientId: '233689486452-ce9fmo95a1c1mp6cgtkj8g4hm8mgbh5a.apps.googleusercontent.com',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
}

@Injectable({
  providedIn: 'root'
})
export class OAuthGoogleService {

  constructor(private oauthService: OAuthService) { this.initGoogleLogin() }



  initGoogleLogin() {
    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  loginGoogle() {
    this.oauthService.initLoginFlow();
  }

  getData() {
    return this.oauthService.getIdentityClaims()
  }

  logOutGoogle() {
    this.oauthService.logOut()
  }
}
