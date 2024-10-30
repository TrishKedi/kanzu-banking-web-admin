//checks for valid two-factor tokens and saves them if requested by the user

var onTwoFactorRememberMe = function (userData, tokenData) {
    var accessToken = tokenData.token;
    twoFactorAccessToken = accessToken;
    httpService.setTwoFactorAccessToken(accessToken);
    scope.$broadcast("UserAuthenticationSuccessEvent", userData);
    localStorageService.addToLocalStorage('userData', userData);
};

var hasValidTwoFactorToken = function (user) {
    var token = getTokenFromStorage(user);
    if (token) {
        return (new Date).getTime() + 7200000 < token.validTo;
    }
    return false;
};
