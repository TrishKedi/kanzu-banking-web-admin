//handle OTP validation, broadcasting the appropriate event based on the outcome.

this.validateOTP = function (token, rememberMe) {
    twoFactorIsRememberMeRequest = rememberMe;
    httpService.post(apiVer + "/twofactor/validate?token=" + token)
        .success(onOTPValidateSuccess)
        .error(onOTPValidateError);
};

var onOTPValidateSuccess = function (data) {
    var accessToken = data.token;
    if (twoFactorIsRememberMeRequest) {
        saveTwoFactorTokenToStorage(userData.username, data);
    }
    twoFactorAccessToken = accessToken;
    httpService.setTwoFactorAccessToken(accessToken);
    scope.$broadcast("UserAuthenticationSuccessEvent", userData);
    localStorageService.addToLocalStorage('userData', userData);
};
