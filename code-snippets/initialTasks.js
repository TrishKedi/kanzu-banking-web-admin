(function (mifosX) {
    var defineHeaders = function ($httpProvider, $translateProvider, ResourceFactoryProvider, HttpServiceProvider, $idleProvider, $keepaliveProvider, IDLE_DURATION, WARN_DURATION, KEEPALIVE_INTERVAL) {
        var mainLink = getLocation(window.location.href);
        var baseApiUrl = "<YOUR_API_BASE_URL>";
        var host = "";
        var portNumber = "";
        
        // Accessing from specific server
        if (mainLink.hostname.indexOf('openmf.org') >= 0) {
            var hostname = window.location.hostname;
            domains = hostname.split('.');
            
            // For multi-tenant hosting
            if (domains[0] === "demo") {
                $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = 'default';
                ResourceFactoryProvider.setTenantIdenetifier('default');
            } else {
                $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = domains[0];
                ResourceFactoryProvider.setTenantIdenetifier(domains[0]);
            }
            host = "https://" + mainLink.hostname;
        }
        // Accessing from a file system or other servers
        else {
            if (mainLink.hostname !== '') {
                baseApiUrl = 'https://' + mainLink.hostname + (mainLink.port ? ':' + mainLink.port : '');
            }
            // Specific access rules based on hostname
            if (mainLink.hostname.includes('<YOUR_SPECIFIC_DOMAIN>')) {
                baseApiUrl = "<YOUR_API_BASE_URL>";
            }

            if (QueryParameters["baseApiUrl"]) {
                baseApiUrl = QueryParameters["baseApiUrl"];
            }
            var queryLink = getLocation(baseApiUrl);
            host = "https://" + queryLink.hostname + (queryLink.port ? ':' + queryLink.port : '');
            portNumber = queryLink.port;
            $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = 'default';
            ResourceFactoryProvider.setTenantIdenetifier('default');

            if (localStorage.getItem("mifosX.tenantId")) {
                var tenantId = localStorage.getItem("mifosX.tenantId");
                $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = tenantId;
                ResourceFactoryProvider.setTenantIdenetifier(tenantId);
            }

            if (QueryParameters["tenantIdentifier"]) {
                $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = QueryParameters["tenantIdentifier"];
                ResourceFactoryProvider.setTenantIdenetifier(QueryParameters["tenantIdentifier"]);
            }
        }

        ResourceFactoryProvider.setBaseUrl(host);
        HttpServiceProvider.addRequestInterceptor('demoUrl', function (config) {
            return _.extend(config, {url: host + config.url });
        });

        // Enable CORS
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // Set headers
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';

        // Configure i18n and preferred language
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useStaticFilesLoader({
            prefix: 'global-translations/locale-',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.fallbackLanguage('en');
        
        // Timeout settings
        $idleProvider.idleDuration(IDLE_DURATION); // Idle time
        $idleProvider.warningDuration(WARN_DURATION); // Warning time (sec)
        $keepaliveProvider.interval(KEEPALIVE_INTERVAL); // Keep-alive ping
    };
    mifosX.ng.application.config(defineHeaders).run(function ($log, $idle) {
        $log.info("Initial tasks are done!");
        $idle.watch();
    });
}(mifosX || {}));

getLocation = function (href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

QueryParameters = (function () {
    var result = {};
    if (window.location.search) {
        var params = window.location.search.slice(1).split("&");
        for (var i = 0; i < params.length; i++) {
            var tmp = params[i].split("=");
            result[tmp[0]] = unescape(tmp[1]);
        }
    }
    return result;
}());
