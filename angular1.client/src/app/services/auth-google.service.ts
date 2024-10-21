import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {

  constructor(private oAuthGoogle: OAuthService) {
    this.googleLogin();
  }


googleLogin() {
  const config: AuthConfig = {
    issuer: 'https://accounts.google.com',
    strictDiscoveryDocumentValidation: false,
    clientId: '233689486452-ce9fmo95a1c1mp6cgtkj8g4hm8mgbh5a.apps.googleusercontent.com',
    redirectUri: window.location.origin + '/dashboard',
    scope: 'openid profile email'
  }

  this.oAuthGoogle.configure(config);
  this.oAuthGoogle.setupAutomaticSilentRefresh();
  this.oAuthGoogle.loadDiscoveryDocumentAndTryLogin();
}

autenticateWithGoogle() {
this.oAuthGoogle.initLoginFlow();
}

logoutGoogle() {
  this.oAuthGoogle.logOut();
}

getProfile() {
  return this.oAuthGoogle.getIdentityClaims();
}

}
