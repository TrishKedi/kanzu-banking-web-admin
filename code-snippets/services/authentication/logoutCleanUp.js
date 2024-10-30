scope.$on("OnUserPreLogout", function () {
    var userDate = localStorageService.getFromLocalStorage("userData");
    localStorageService.removeFromLocalStorage("userData");
    removeTwoFactorTokenFromStorage(userDate.username);
    httpService.post(apiVer + "/twofactor/invalidate", '{"token": "' + twoFactorAccessToken + '"}');
});
