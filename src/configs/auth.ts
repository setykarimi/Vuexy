export default {
  meEndpoint: '/auth/me',
  loginEndpoint: 'https://ipa4.metakhodro.ir/v2/Auth/User/Login/Password',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
