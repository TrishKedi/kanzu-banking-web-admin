// manages token renewal with a timer:

var setTimer = function(time) {
    timeout(getAccessToken, time * 1000);
};

var getAccessToken = function() {
    var refreshToken = localStorageService.getFromLocalStorage("tokendetails").refresh_token;
    httpService.cancelAuthorization();
    httpService.post("/fineract-provider/api/oauth/token?&client_id=community-app&grant_type=refresh_token&client_secret=123&refresh_token=" + refreshToken)
        .success(updateAccessDetails);
};
