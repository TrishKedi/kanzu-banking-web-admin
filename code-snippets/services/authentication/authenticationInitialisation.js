function AuthenticationService (scope, httpService, SECURITY, localStorageService, timeout, webStorage) {
    var userData = null;
    var twoFactorIsRememberMeRequest = false;
    var twoFactorAccessToken = null;

    var onLoginSuccess = function (data) {
        if (data.isTwoFactorAuthenticationRequired) {
            if (hasValidTwoFactorToken(data.username)) {
                var token = getTokenFromStorage(data.username);
                onTwoFactorRememberMe(data, token);
            } else {
                userData = data;
                scope.$broadcast("UserAuthenticationTwoFactorRequired", data);
            }
        } else {
            scope.$broadcast("UserAuthenticationSuccessEvent", data);
            localStorageService.addToLocalStorage('userData', data);
        }
    };
}
